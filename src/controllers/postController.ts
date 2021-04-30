import express from 'express';
import {userService} from '../services/userService';
import {PostModel} from '../models/Post';
import {postService} from '../services/postService';
import {commentService} from '../services/commentService';
import {likeService} from '../services/likeService';
import {gfsService} from '../services/gfsService';
import {UserModel} from '../models/User';
import {LikeModel} from '../models/Like';
import {labelToPostService} from '../services/labeToPostService';
import {followerFollowService} from '../services/followFollowerService';
import {LabelToPostModel} from "../models/LabelToPost";
import {labelService} from "../services/labelService";
import {LabelModel} from '../models/Label';
import {POSTS_LIST_SIZE} from '../utils/constants';
import {getCommentsData} from "./commentController";

const gatherPostData = async (post: PostModel, allPostsData?: boolean) => {
    if (post) {
        const user = await userService.findUserByQuery({_id: post.author}) as UserModel;
        const labelsToPost = await labelToPostService.findPostLabels(post._id) as LabelToPostModel[];
        const labels = [] as LabelModel[];
        for (let l of labelsToPost) {
            const label = await labelService.findLabelBy({_id: l.label}) as LabelModel;
            if (label) {
                labels.push(label);
            }
        }

        if (!user) {
            return null;
        }

        const likes = await likeService.findPostLikes({post: post._id}) as LikeModel[];
        let likesValue = 0;
        if (likes) {
            for (let like of likes) {
                likesValue += like.value;
            }
        }

        if (allPostsData) {
            const commentsCount = await commentService.countComments({post: post._id});
            return {
                id: post._id,
                authorId: post.author,
                author: user.name,
                labels,
                commentsCount,
                likesValue,
                title: post.title,
                text: post.text.slice(0, 55),
                createdAt: post.createdAt
            }
        }

        const commentsData = await getCommentsData({postId: post._id});

        return {
            id: post._id,
            authorId: post.author,
            author: user.name,
            labels,
            comments: commentsData.comments,
            showMoreComments: commentsData.showMoreComments,
            likesValue,
            title: post.title,
            text: post.text,
            filename: post.filename,
            createdAt: post.createdAt
        }
    }
}

class PostController {
    async deletePostImage(req: express.Request, res: express.Response) {
        const postId = req.params.id;
        const post = await postService.findPostBy({_id: postId}) as PostModel;
        if (post && post.filename) {
            await gfsService.deleteItem(post.filename, res);
            post.filename = "";
            post.save();
            return res.status(200).send();
        } else {
            return res.status(404).send({
                type: 'ERROR',
                message: 'Post or image not found'
            });
        }
    }

    async updatePost(req: express.Request, res: express.Response) {
        const postId: string = req.params.id as string;
        const userId = req.headers.id as string;
        const filename = req.file?.filename || '';
        const {title, text} = req.body;
        const user = await userService.findUserByQuery({_id: userId as string});
        const post = await postService.findPostBy({_id: postId}) as PostModel;

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

        if (post.author !== userId) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'This user is not authorised to change this post'
            });
        }

        const oldFile = post.filename || '';
        if (filename && oldFile) {
            await gfsService.deleteItem(oldFile, res, filename);
        }

        const updatePost = {
            author: post.author,
            filename: filename || oldFile,
            title: title || post.title,
            text: text || post.text
        } as unknown as PostModel;

        try {
            await postService.updatePost(postId, updatePost);
            const updatedPost = await postService.findPostBy({_id: postId}) as PostModel;
            const postData = await gatherPostData(updatedPost);
            return res.status(200).send({
                post: postData
            })
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during post creation'
            });
        }

    }

    async deletePost(req: express.Request, res: express.Response) {
        const postId: string = req.params.id as string;
        if (postId) {
            const post = await postService.findPostBy({_id: postId}) as PostModel;
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
        const user = await userService.findUserByQuery({_id: userId as string});
        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        const newPost = {
            filename,
            author: userId,
            title,
            text,
        } as unknown as PostModel;

        try {
            const createdPost = await postService.createPost(newPost) as PostModel;
            for (let l of (JSON.parse(labels) || [])) {
                await labelToPostService.addLabelToPost({label: l.id, post: createdPost._id} as LabelToPostModel)
            }

            return res.status(200).send({
                id: createdPost._id
            })
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during post creation'
            });
        }
    }

    async readPost(req: express.Request, res: express.Response) {
        const postId: string = req.params.id as string;
        if (!postId) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid post id'
            });
        }

        const post = await postService.findPostBy({_id: postId}) as PostModel;
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

    async getPostImage(req: express.Request, res: express.Response) {
        const filename = req.params.filename;
        return gfsService.getItem(filename, res);
    }

    async readPosts(req: express.Request, res: express.Response) {
        const {createdAt, size, labelIds, authorId} = req.query;
        const searchQuery: any = {}
        const parsedLabelsIds: string[] = labelIds ? (labelIds as string).split(',') : [];
        const postsData: any[] = [];
        const postsListSize = Number(size) || POSTS_LIST_SIZE;
        let showMorePosts = false;

        if (createdAt) {
            searchQuery.createdAt = {$lt: createdAt};
        }

        if (parsedLabelsIds && parsedLabelsIds.length > 0) {
            searchQuery.labelsId = parsedLabelsIds;
        }

        if (authorId) {
            const user = await userService.findUserByQuery({_id: authorId as string});
            if (!user) {
                res.status(200).send({
                    posts: []
                })
            }
            searchQuery.authorId = authorId;
        }

        let posts = await postService.findPostsBy(searchQuery)
            .limit(postsListSize + 1)
            .sort('-createdAt') as PostModel[];

        if (posts?.length === POSTS_LIST_SIZE + 1) {
            showMorePosts = true;
            posts = posts.slice(0, postsListSize);
        }

        for (let p of posts) {
            const postData = await gatherPostData(p, true);
            if (postsData) {
                postsData.push(postData);
            }
        }

        res.status(200).send({
            posts: postsData,
            showMorePosts
        })
    }

    async showFollowPosts(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const user = await userService.findUserByQuery({_id: userId as string}) as UserModel;
        const postsData: any[] = [];

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        const lastReviewDate = user.lastReviewDate;
        const followUsers = await followerFollowService.findFollow(userId);
        for (let follow of followUsers) {
            const followPosts = await postService.findPostsBy({
                author: follow, "createdAt": {
                    $gte: lastReviewDate
                }
            }) as PostModel[];
            for (let followPost of followPosts) {
                const postData = await gatherPostData(followPost);
                postsData.push(postData);
            }
        }
        res.status(200).send({
            posts: postsData
        })
    }
}

const postController = new PostController();

export default postController;
