import express from 'express';
import { likeService } from '../services/likeService';
import { LikeModel } from '../models/Like';

const likeValue = (v: number) => v > 0 ? 1 : v < 0 ? -1 : 0;

class LikeController {
    async setLike(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const { postId, value } = req.body;
        const like = await likeService.findPostLike({ user: userId, post: postId }) as unknown as LikeModel;

        if (!like.value) {
            try {
                await likeService.saveLike({
                    value: likeValue(value),
                    user: userId,
                    post: postId
                } as LikeModel)
                return res.status(200).send();
            } catch (e) {
                return res.status(500).send({
                    type: 'ERROR',
                    message: 'Error occurs setting like'
                });
            }
        }
        return res.status(400).send({
            type: 'ERROR',
            message: 'Cannot create same like twice'
        });
    }

    async changeLike(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const { postId, value } = req.body;
        const like = await likeService.findPostLike({ user: userId, post: postId }) as unknown as LikeModel;
        if (like) {
            like.value = likeValue(value);
            await like.save();
            return res.status(200).send();
        } else {
            return res.status(404).send({
                type: 'ERROR',
                message: 'Cannot find like'
            });
        }
    }

    async getLikeByPostUser(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const postId = req.params.postId as string;
        const like = await likeService.findPostLike({ user: userId, post: postId }) as unknown as LikeModel;
        if (!like) {
            return res.status(200).send({
                value: 0
            });
        } else {
            return res.status(200).send({
                value: like.value
            });
        }
    }

    async getLikeValueForPost(req: express.Request, res: express.Response) {
        const postId = req.params.postId as string;
        const likes = await likeService.findPostLikes({post: postId}) as LikeModel[];
        let likesValue = 0;
        if (likes) {
            for (let like of likes) {
                likesValue += like.value;
            }
            return res.status(200).send({
                value: likesValue
            });
        } else {
            return res.status(200).send({
                value: 0
            });
        }
    }
}

const likeController = new LikeController();

export default likeController;
