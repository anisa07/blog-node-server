import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {userService} from '../services/userService';
import {PostModel} from '../models/Post';
import {postService} from '../services/postService';
import {commentService} from '../services/commentService';
import {likeService} from '../services/likeService';
import {gfsService} from '../services/gfsService';
import {USER_TYPE, UserModel} from '../models/User';
import {LikeModel} from '../models/Like';
import {labelToPostService} from '../services/labeToPostService';
import {followerFollowService} from '../services/followFollowerService';
import {LabelToPostModel} from "../models/LabelToPost";
import {labelService} from "../services/labelService";
import {LabelModel} from '../models/Label';
import {POSTS_LIST_SIZE} from '../utils/constants';
import {getCommentsData} from "./commentController";
import {PaginateResult} from 'mongoose';

const gatherPostData = async (post: PostModel, allPostsData?: boolean) => {
    if (post) {
        const user = await userService.findUserByQuery({id: post.authorId}) as UserModel;
        const labelsToPost = await labelToPostService.findPostLabels(post.id) as LabelToPostModel[];
        const labels = [] as LabelModel[];
        for (let l of labelsToPost) {
            const label = await labelService.findLabelBy({id: l.labelId}) as LabelModel;
            if (label) {
                labels.push(label);
            }
        }

        if (!user) {
            return null;
        }

        const likes = await likeService.findPostLikes({postId: post.id}) as LikeModel[];
        let likesValue = 0;
        if (likes) {
            for (let like of likes) {
                likesValue += like.value;
            }
        }

        if (allPostsData) {
            const commentsCount = await commentService.countComments({post: post.id});
            return {
                id: post.id,
                authorId: post.authorId,
                author: user.name,
                labels,
                commentsCount,
                likesValue,
                title: post.title,
                text: post.text.slice(0, 55),
                filename: post.filename,
                updatedAt: post.updatedAt
            }
        }

        const commentsData = await getCommentsData({postId: post.id});

        return {
            id: post.id,
            authorId: post.authorId,
            author: user.name,
            labels,
            comments: commentsData.comments,
            showMoreComments: commentsData.showMoreComments,
            likesValue,
            title: post.title,
            text: post.text,
            filename: post.filename,
            updatedAt: post.updatedAt
        }
    }
}

class PostController {
    async deletePostImage(req: express.Request, res: express.Response) {
        const postId = req.params.postId;
        const post = await postService.findPostBy({id: postId}) as PostModel;
        if (post && post.filename) {
            await gfsService.deleteItem(post.filename, res);
            post.filename = "";
            await post.save();
            return res.status(200).send();
        } else {
            return res.status(404).send({
                type: 'ERROR',
                message: 'Post or image not found'
            });
        }
    }

    async updatePost(req: express.Request, res: express.Response) {
        const postId: string = req.params.postId as string;
        const userId = req.headers.id as string;
        const filename = req.file?.filename || req.body.filename || '';
        const {title, text, labels} = req.body;
        const user = await userService.findUserByQuery({id: userId as string});
        const post = await postService.findPostBy({id: postId}) as PostModel;

        if (!post) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'Post not found'
            });
        }

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        if (post.authorId !== userId && user.type !== USER_TYPE.SUPER) {
            return res.status(403).send({
                type: 'ERROR',
                message: 'This user is not authorised to change this post'
            });
        }

        const oldFile = post.filename || '';
        if (filename && oldFile && filename !== oldFile) {
            await gfsService.deleteItem(oldFile, res, filename);
        }

        if (!filename && oldFile) {
            await gfsService.deleteItem(oldFile, res);
        }

        const updatePost = {
            authorId: post.authorId,
            filename: filename,
            title: title || post.title,
            text: text || post.text
        } as unknown as PostModel;

        try {
            await postService.updatePost(postId, updatePost);
            for (let l of (JSON.parse(labels) || [])) {
                await labelToPostService.addLabelToPost({labelId: l.id, postId} as LabelToPostModel)
            }
            return res.status(200).send({
                id: postId
            })
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during post update'
            });
        }

    }

    async deletePost(req: express.Request, res: express.Response) {
        const postId: string = req.params.postId as string;
        if (postId) {
            const post = await postService.findPostBy({id: postId}) as PostModel;
            if (post && post.filename) {
                await gfsService.deleteItem(post.filename, res);
            }
            await postService.deletePost(postId);
            res.status(200).send()
        } else {
            res.status(400).send({
                type: 'ERROR',
                message: 'Post id is required'
            });
        }
    }

    async createPost(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const filename = req.file?.filename || '';
        const {title, text, labels} = req.body;
        const user = await userService.findUserByQuery({id: userId as string});
        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        const postId = uuidv4();
        const newPost = {
            id: postId,
            filename,
            author: userId,
            title,
            text,
        } as unknown as PostModel;

        try {
            await postService.createPost(newPost);
            for (let l of (JSON.parse(labels) || [])) {
                await labelToPostService.addLabelToPost({labelId: l.id, postId} as LabelToPostModel)
            }

            return res.status(200).send({
                id: postId
            })
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during post creation'
            });
        }
    }

    async readPost(req: express.Request, res: express.Response) {
        const postId: string = req.params.postId as string;
        if (!postId) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid post id'
            });
        }

        const post = await postService.findPostBy({id: postId}) as PostModel;
        const postData = await gatherPostData(post);
        if (!post) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'Post not found'
            });
        } else {
            return res.status(200).send(postData)
        }
    }

    // TODO refactor
    async getPostImage(req: express.Request, res: express.Response) {
        const filename = req.params.filename;
        return gfsService.getItem(filename, res);
    }

    async readPosts(req: express.Request, res: express.Response) {
        const {size, labelIds, authorId, searchText, sortBy, sortDir, page, searchBy} = req.query;
        const searchQuery: any = {}
        const parsedLabelsIds: string[] = labelIds ? (labelIds as string).split(',') : [];
        const postsData: any[] = [];
        const postsListSize = Number(size) || POSTS_LIST_SIZE;
        const postsPage = Number(page) || 1;
        let data: PaginateResult<PostModel>;

        if (searchBy === "author" && searchText) {
            const regex = new RegExp(`.*${searchText}.*`, 'i');
            const user = await userService.findUserByQuery({name: {$regex: regex}});
            if (!user) {
                return res.status(200).send({
                    posts: [],
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalDocs: 0,
                    totalPages: 0
                })
            }
            searchQuery.author = user.id;
        } else if (authorId) {
            const user = await userService.findUserByQuery({id: authorId as string});
            if (!user) {
                res.status(200).send({
                    posts: []
                })
            }
            searchQuery.author = authorId;
        }

        if (parsedLabelsIds && parsedLabelsIds.length > 0) {
            searchQuery.labelsId = parsedLabelsIds;
        }

        let dir = sortDir === 'asc' ? 1 : -1;
        let sortField: string | {[key:string]: any} = '-updatedAt';
        if (!!sortBy) {
            sortField = {[sortBy as string]: dir}
        }

        if (searchText && searchBy !== "author") {
            data = await postService.findPostsByText({
                query: searchQuery,
                sort: sortField,
                page: postsPage,
                size: postsListSize,
                text: searchText as string,
                searchBy: searchBy === 'title' ? 'title' : ''
            });
        } else {
            data = await postService.findPostsBy({
                query: searchQuery,
                sort: sortField,
                page: postsPage,
                size: postsListSize,
            });
        }

        for (let p of data.docs) {
            const postData = await gatherPostData(p, true);
            if (postsData) {
                postsData.push(postData);
            }
        }

        res.status(200).send({
            posts: postsData,
            hasNextPage: data.hasNextPage,
            hasPreviousPage: data.hasPrevPage,
            totalDocs: data.totalDocs,
            totalPages: data.totalPages
        })
    }

    async showFollowPosts(req: express.Request, res: express.Response) {
        const {size, page} = req.query;
        const userId = req.headers.id as string;
        const user = await userService.findUserByQuery({id: userId as string}) as UserModel;
        const postsData: any[] = [];
        const lastReviewDate = user.lastReviewDate || 0;
        user.lastReviewDate = new Date();
        await user.save();
        const followUsers = await followerFollowService.findFollow(userId);
        let followPosts = {} as PaginateResult<PostModel>;
        for (let follow of followUsers) {
            followPosts = await postService.findPostsBy({
                query: {
                    authorId: follow.followId,
                    updatedAt: {$gte: new Date(lastReviewDate)}
                },
                sort: '-updatedAt',
                page:  Number(page) || 1,
                size: Number(size) || POSTS_LIST_SIZE
            });

            for (let followPost of followPosts.docs) {
                const postData = await gatherPostData(followPost);
                postsData.push(postData);
            }
        }
        return res.status(200).send({
            posts: postsData,
            hasNextPage: followPosts.hasNextPage,
            hasPreviousPage: followPosts.hasPrevPage,
            totalDocs: followPosts.totalDocs,
            totalPages: followPosts.totalPages
        })
    }
}

const postController = new PostController();

export default postController;
