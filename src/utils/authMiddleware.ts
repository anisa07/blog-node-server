
import express from 'express';
import jwt from 'jsonwebtoken';
import { redisService } from '../services/redisService';
import {isAuth} from "../controllers/userController";

export const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = (req.headers.authorization || '').split(' ')[1];
        const userId = req.headers.id as string;
        const auth = await isAuth(userId, token);
        if (auth) {
            next();
        } else {
            return res.status(401).send({
                type: 'ERROR',
                message: 'User is not logged in'
            });
        }
    } catch (e) { 
        return res.status(401).send({
            type: 'ERROR',
            message: 'User is not logged in'
        });
    }
}
