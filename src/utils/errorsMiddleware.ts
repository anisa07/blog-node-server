import express from "express";
import {Error} from "mongoose";

export const logErrors = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    next(err);
}

export const clientErrorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.status(500).send({error: 'Server error'});
}
