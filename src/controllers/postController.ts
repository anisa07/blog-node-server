import express from 'express';
import { userService } from '../services/userService';
import { labelService } from '../services/labelService';
import { PostModel } from '../models/Post';
import { postService } from '../services/postService';
import { gfsService } from '../services/gfsService';
import { LabelModel } from '../models/Label';
import { UserModel } from '../models/User';

class PostController {
    async deletePostImage(req: express.Request, res: express.Response) {
        const postId = req.params.id;
        const post = await postService.findPostBy({ _id: postId }) as PostModel;
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
        const { labels, title, text, comments } = req.body;
        const user = await userService.findUserByQuery({ _id: userId as string });
        const parsedLabels: string[] = labels ? labels.split(', ') : [];
        const parsedComments: string[] = comments ? comments.split(', ') : [];
        const post = await postService.findPostBy({ _id: postId }) as PostModel;

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

        if (post.authorId !== userId) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'This user is not authorised to change this post'
            });
        }

        const oldFile = post.filename;
        if (filename && oldFile) {
            await gfsService.deleteItem(oldFile, res, filename);
        }

        const updatePost = {
            authorId: post.authorId,
            filename: filename || oldFile,
            title: title || post.title,
            text: text || post.text,
            labelsId: parsedLabels.length > 0 ? parsedLabels : post.labelIds,
            commentIds: parsedComments.length > 0 ? parsedComments : post.commentIds
        } as unknown as PostModel;

        try {
            await postService.updatePost(postId, updatePost);

            return res.status(200).send({
                id: postId,
                filename,
                title,
                text
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
            const post = await postService.deletePost(postId);
            res.status(200).send({
                post
            })
        } else {
            res.status(200).send(null);
        }
    }

    async createPost(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const filename = req.file?.filename || '';
        const { labels, title, text, } = req.body;
        const user = await userService.findUserByQuery({ _id: userId as string });
        const parsedLabelsIds: string[] = labels ? labels.split(', ') : [];

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        if (parsedLabelsIds.length === 0 || !title || !title.trim() || !text || !text.trim()) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid post data'
            });
        }

        for await (let label of parsedLabelsIds) {
            if (label && label.trim()) {
                const l = await labelService.findLabelBy({ _id: label });
                if (!l) {
                    return res.status(404).send({
                        type: 'ERROR',
                        message: 'Label not found'
                    });
                }
            }
        }

        const newPost = {
            filename,
            authorId: userId,
            title,
            text,
            labelIds: parsedLabelsIds,
            commentIds: [],
        } as unknown as PostModel;

        try {
            const createdPost = await postService.createPost(newPost);

            return res.status(200).send({
                id: createdPost._id,
                filename,
                title,
                text
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
        const labels: string[] = [];
         if (postId) {
            const post = await postService.findPostBy({ _id: postId }) as PostModel;
            const user = await userService.findUserByQuery({ _id: post.authorId }) as UserModel;
            for await (let labelId of post.labelIds) {
                const l = await labelService.findLabelBy({ _id: labelId }) as LabelModel;
                if (l) {
                    labels.push(l.name)
                }
            }

            res.status(200).send({
                ...post,
                author: user.name,
                labels,
                //comments
            })
        } else {
            res.status(200).send(null);
        }
    }

    async readPosts(req: express.Request, res: express.Response) {
        const { createdAt, size, labels, authorId } = req.query;
        const searchQuery: any = {}
        const labelsId: string[] = [];
        const postLabels = labels as string[];

        if (createdAt) {
            searchQuery.createdAt = { $lte: createdAt };
        }

        if (postLabels && postLabels.length > 0) {
            for await (let label of postLabels) {
                if (label && label.trim()) {
                    const l = await labelService.findLabelBy({ name: label });
                    if (l) {
                        labelsId.push(l._id);
                    }
                }
            }
            if (labelsId.length === 0) {
                res.status(200).send({
                    posts: []
                })
            }
            searchQuery.labelsId = labelsId;
        }

        if (authorId) {
            const user = await userService.findUserByQuery({ _id: authorId as string });

            if (!user) {
                res.status(200).send({
                    posts: []
                })
            }

            searchQuery.authorId = authorId;
        }

        const posts = await postService.findPostsBy(searchQuery)
            .limit(Number(size) || 10)
            .sort('-createdAt');
        // console.log(posts);
        // console.log('searchQuery', searchQuery);
        // console.log(req.query)
        res.status(200).send({
            posts: posts || []
        })
    }
}

const postController = new PostController();

export default postController;
