import express, {query} from 'express';
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
import {PaginateResult} from 'mongoose';

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
                filename: post.filename,
                updatedAt: post.updatedAt
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
            updatedAt: post.updatedAt
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

        if (post.author.toString() !== userId) {
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
            searchQuery.author = user._id;
        } else if (authorId) {
            const user = await userService.findUserByQuery({_id: authorId as string});
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

        console.log("query", searchQuery)
        console.log("sortField", sortField)
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
            let followPosts = {} as PaginateResult<PostModel>;
            followPosts = await postService.findPostsBy({
                query: {
                    author: follow, "updatedAt": {
                        $gte: lastReviewDate
                    }
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
        res.status(200).send({
            posts: postsData
        })
    }
}

const postController = new PostController();

export default postController;
