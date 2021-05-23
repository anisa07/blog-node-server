
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
                message: 'Not authorised'
            });
        }

        // if (!userId) {
        //     return res.status(401).send({
        //         type: 'ERROR',
        //         message: 'Not authorised'
        //     });
        // }
        // const salt = await redisService.getItem(userId as string);
        // if (!salt) {
        //     return res.status(401).send({
        //         type: 'ERROR',
        //         message: 'Not authorised'
        //     });
        // }
        // const decodedToken = jwt.verify(token, salt) as { exp: number, userId: string };
        // if(decodedToken.userId === userId) {
        //     next();
        // } else {
        //     return res.status(401).send({
        //         type: 'ERROR',
        //         message: 'Not authorised'
        //     });
        // }
    } catch (e) { 
        return res.status(401).send({
            type: 'ERROR',
            message: 'Not authorised'
        });
    }
}
