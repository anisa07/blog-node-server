import express from 'express';
import { likeService } from '../services/likeService';
import { LikeModel } from '../models/Like';

const likeValue = (v: number) => v > 0 ? 1 : v < 0 ? -1 : 0;

class LikeController {
    async setLike(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const { postId, value } = req.body;
        const like = likeService.findPostLike({ userId, postId }) as unknown as LikeModel;
        if (!like) {
            try {
                likeService.saveLike({
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
        const likeId = req.params.id as string;
        const like = likeService.findPostLike({ _id: likeId }) as unknown as LikeModel;
        if (like && like.user === userId && like.post === postId) {
            like.value = likeValue(value);
            like.save();
            res.status(200).send();
        } else {
            res.status(404).send({
                type: 'ERROR',
                message: 'Cannot find like'
            });
        }
    }

    async getLikeByUser(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const postId = req.params.id as string;
        const like = await likeService.findPostLike({ userId, postId }) as unknown as LikeModel;
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
}

const likeController = new LikeController();

export default likeController;
