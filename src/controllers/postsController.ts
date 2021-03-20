import express from 'express';
import { userService } from '../services/userService';
import { labelsService } from '../services/labelService';
import { LabelModel } from '../models/Label';
import { PostModel } from '../models/Post';
import { postsService } from '../services/postService';

class PostsController {
    async updatePost(req: express.Request, res: express.Response) { }

    async deletePost(req: express.Request, res: express.Response) { }

    async createPost(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const filename = req.file?.filename || '';
        const { labels, title, text, } = req.body;
        const user = await userService.findUserByQuery({ _id: userId as string });
        const parsedLabels: string[] = labels ? labels.split(', ') : [];

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        if (parsedLabels.length === 0 || !title || !title.trim() || !text || !text.trim()) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid post data'
            });
        }

        const labelIds: string[] = [];
        const createdLabels: string[] = [];

        for await (let label of parsedLabels) {
            if (label && label.trim()) {
                const l = await labelsService.findLabelBy({ name: label });
                if (l && !labelIds.includes(l._id) && !createdLabels.includes(label)) {
                    createdLabels.push(label);
                    labelIds.push(l._id);
                } else if (!l && !createdLabels.includes(label)) {
                    const name = label.toLowerCase();
                    const newLabel = {
                        name
                    } as LabelModel;
                    const createdLabel = await labelsService.createLabel(newLabel);
                    createdLabels.push(name);
                    labelIds.push(createdLabel._id);
                }
            }
        }

        if (labelIds.length === 0) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid post data'
            });
        }

        const newPost = {
            filename,
            authorId: userId,
            title,
            text,
            labelIds,
            commentIds: [],
        } as unknown as PostModel;

        try {
            const createdPost = await postsService.createPost(newPost);

            return res.status(200).send({
                labels: createdLabels,
                filename,
                title,
                text,
                author: {
                    id: user._id,
                    name: user.name
                },
                comments: [],
            })
        } catch(e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during post creation'
            });
        }
    }

    async readPost(req: express.Request, res: express.Response) { }

    async readPosts(req: express.Request, res: express.Response) {
        const { createdAt, size, labels, authorId } = req.query;
        const searchQuery: any = {}
        const labelsId: string[] = [];
        const postLabels = labels as string[];

        if(createdAt) {
            searchQuery.createdAt ={ $lte: createdAt };
        }

        if (postLabels && postLabels.length > 0) {
            for await (let label of postLabels) {
                if (label && label.trim()) {
                    const l = await labelsService.findLabelBy({ name: label });
                    if (l) {
                        labelsId.push(l._id);
                    }
                }
            }
            if(labelsId.length === 0) {
                res.status(200).send({
                    posts: []
                })
            }
            searchQuery.labelsId = labelsId;
        }

        if (authorId) {
            const user = await userService.findUserByQuery({ _id: authorId as string });

            if(!user) {
                res.status(200).send({
                    posts: []
                })
            }

            searchQuery.authorId = authorId;
        }
    
        const posts = await postsService.findPostsBy(searchQuery)
        .limit(Number(size) || 10)
        .sort( '-createdAt' );
        console.log(posts);
        console.log('searchQuery', searchQuery);
        console.log(req.query)
        res.status(200).send({
            posts: posts || []
        })
    }
}

const postsController = new PostsController();

export default postsController;
