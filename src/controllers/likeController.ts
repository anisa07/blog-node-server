import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {likeService} from '../services/likeService';
import {LikeModel} from '../models/Like';
import {serverError} from "../utils/errors";

const likeValue = (v: number) => v > 0 ? 1 : v < 0 ? -1 : 0;

class LikeController {
    async setLike(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const {postId, value} = req.body;
        const like = await likeService.findPostLike({userId, postId}) as unknown as LikeModel;

        if (!like || !like.value) {
            try {
                await likeService.saveLike({
                    id: uuidv4(),
                    value: likeValue(value),
                    userId,
                    postId
                } as LikeModel)
                return res.status(200).send({});
            } catch (e) {
                return serverError(res)
            }
        }
        return res.status(400).send({
            type: 'ERROR',
            message: 'Impossible to like or dislike twice'
        });
    }

    async changeLike(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const {postId, value} = req.body;
        const like = await likeService.findPostLike({userId, postId}) as unknown as LikeModel;
        if (like) {
            like.value = likeValue(value);
            await like.save();
            return res.status(200).send({});
        } else {
            return res.status(404).send({
                type: 'ERROR',
                message: 'Like for this post is not found'
            });
        }
    }

    async getLikeByPostUser(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const postId = req.params.postId as string;
        const like = await likeService.findPostLike({userId, postId}) as unknown as LikeModel;
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
        const likes = await likeService.findPostLikes({postId}) as LikeModel[];
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
