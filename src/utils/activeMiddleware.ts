
import express from 'express';
import { STATE, UserModel } from '../models/User';
import { userService } from '../services/userService';

export const active = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let searchQuery = null;
    let id = req.headers.id || req.body?.id;
    
    if (id) {
        searchQuery = { _id: id as string }
    } else if (req.body?.email) {
        searchQuery = { email: req.body.email }
    }

    if (!searchQuery) {
        return res.status(400).send({
            type: 'ERROR',
            message: 'Payload is incorrect'
        });
    }

    const user = await userService.findUserByQuery(searchQuery);
    if (!user) {
        return res.status(404).send({
            type: 'ERROR',
            message: 'User not found'
        });
    }

    if (user.state !== STATE.ACTIVE) {
        return res.status(403).send({
            type: 'ERROR',
            message: 'User is deleted or blocked'
        });
    }

    next();
}
