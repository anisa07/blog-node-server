import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {commentService} from '../services/commentService';
import {CommentModel} from '../models/Comment';
import {COMMENTS_LIST_SIZE} from "../utils/constants";
import {userService} from "../services/userService";
import {UserModel} from "../models/User";
import {PaginateResult} from "mongoose";

export const getCommentsData = async (query: { updatedAt?: any, size?: any, postId?: string, page?: any }) => {
    const searchQuery: any = {}
    const commentsListSize = Number(query.size) || COMMENTS_LIST_SIZE;
    const commentPage = Number(query.page) || 1;
    let data: PaginateResult<CommentModel>;

    searchQuery.post = query.postId;

    data = await commentService.findComments(searchQuery, commentPage, commentsListSize);

    let commentsWithUsername = [] as { [key: string]: any }[];

    for (let comment of data.docs) {
        const user = await userService.findUserByQuery({id: comment.userId}) as UserModel;
        commentsWithUsername.push({
            username: user.name,
            updatedAt: comment.updatedAt,
            text: comment.text,
            id: comment.id,
            userId: comment.userId,
            postId: comment.postId,
        });
    }

    return {
        comments: commentsWithUsername,
        showMoreComments: data.hasNextPage
    }
}


class CommentController {
    async createComment(req: express.Request, res: express.Response) {
        const text = req.body.text as string;
        const postId = req.body.postId as string;
        const userId = req.headers.id as string;

        if (!text || !text.trim()) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid comment data'
            });
        }

        try {
            const commentId = uuidv4();
            await commentService.createComment({text, userId, postId, id: commentId} as CommentModel);
            return res.status(200).send({
                id: commentId,
                text,
                userId,
                postId
            })
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during post creation'
            });
        }
    }

    async updateComment(req: express.Request, res: express.Response) {
        const text = req.body.text as string;
        const postId = req.body.postId as string;
        const userId = req.headers.id as string;
        const commentId = req.params.id as string;

        if (!text || !text.trim()) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid comment data'
            });
        }

        try {
            await commentService.updateComment(commentId, userId, postId, {text} as CommentModel);
            return res.status(200).send({
                id: commentId,
                text,
                postId,
                userId
            })
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during post creation'
            });
        }

    }

    async readAllPostComments(req: express.Request, res: express.Response) {
        const postId = req.params.postId as string;
        const {updatedAt, size, page} = req.query;
        const data = await getCommentsData({postId, updatedAt, size, page})

        return res.status(200).send({
            comments: data.comments || [],
            showMoreComments: data.showMoreComments,
        })
    }

    async readComment(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const commentId = req.params.id as string;
        const comment = await commentService.findCommentBy({id: commentId, userId: userId});

        if (!comment) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'Comment not found'
            });
        } else {
            return res.status(200).send({
                comment
            })
        }
    }

    async deleteComment(req: express.Request, res: express.Response) {
        const commentId = req.params.id as string;
        const userId = req.headers.id as string;

        await commentService.deleteComment({id: commentId, userId: userId});
        return res.status(200).send({
            commentId
        })
    }
}

const commentController = new CommentController();

export default commentController;
