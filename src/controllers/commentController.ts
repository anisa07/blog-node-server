import express from 'express';
import {commentService} from '../services/commentService';
import {CommentModel} from '../models/Comment';
import {COMMENTS_LIST_SIZE} from "../utils/constants";
import {userService} from "../services/userService";
import {UserModel} from "../models/User";

export const getCommentsData = async (query: { createdAt?: any, size?: any, postId?: string }) => {
    const searchQuery: any = {}
    let showMoreComments = false;
    const commentsListSize = Number(query.size) || COMMENTS_LIST_SIZE;

    if (query.createdAt) {
        searchQuery.createdAt = {$lt: query.createdAt};
    }

    searchQuery.post = query.postId;

    let comments = await commentService.findComments(searchQuery)
        .limit(commentsListSize + 1)
        .sort('-createdAt') as CommentModel[];

    let commentsWithUsername = [] as { [key: string]: any }[]

    if (comments?.length === COMMENTS_LIST_SIZE + 1) {
        showMoreComments = true;
        comments = comments.slice(0, commentsListSize);
    }

    if (comments) {
        for (let comment of comments) {
            const user = await userService.findUserByQuery({_id: comment.user}) as UserModel;
            commentsWithUsername.push({
                username: user.name,
                createdAt: comment.createdAt,
                text: comment.text,
                id: comment._id,
                userId: comment.user,
                postId: comment.post,
            });
        }
    }

    return {
        comments: commentsWithUsername,
        showMoreComments
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
            const comment = await commentService.createComment({text, user: userId, post: postId} as CommentModel);
            return res.status(200).send({
                id: comment._id,
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
        const {createdAt, size} = req.query;
        const data = await getCommentsData({postId, createdAt, size})

        return res.status(200).send({
            comments: data.comments || [],
            showMoreComments: data.showMoreComments,
        })
    }

    async readComment(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const commentId = req.params.id as string;
        const comment = await commentService.findCommentBy({_id: commentId, user: userId});

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

        await commentService.deleteComment({_id: commentId, user: userId});
        return res.status(200).send({
            commentId
        })
    }
}

const commentController = new CommentController();

export default commentController;
