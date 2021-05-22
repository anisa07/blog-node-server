import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose, { Mongoose } from 'mongoose';
import userRouter from './routes/user';
import postRouter from './routes/post';
import labelRouter from './routes/label';
import commentRouter from './routes/comment';
import likeRouter from './routes/like';
import apiRouter from './routes/api';
import connectDb from './dbs/mongoDb';
import redisClient from './dbs/redisDb';

redisClient.on("error", (error) => {
    console.error(`Redis error: ${error}`);
});

redisClient.on("connect", () => {
    console.log(`connect`);
});

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`/${process.env.API_VERSION}`, userRouter);
app.use(`/${process.env.API_VERSION}/api-docs`, apiRouter);
app.use(`/${process.env.API_VERSION}/post`, postRouter);
app.use(`/${process.env.API_VERSION}/label`, labelRouter);
app.use(`/${process.env.API_VERSION}/comment`, commentRouter);
app.use(`/${process.env.API_VERSION}/like`, likeRouter);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let gfs: any;
connectDb().then(async (result: Mongoose) => {
    if (result && result.connection && result.connection && result.connections[0].db) {
        gfs = new mongoose.mongo.GridFSBucket(result.connections[0].db, {
            bucketName: "uploads"
          });
    }
    app.listen(process.env.PORT, () =>
        console.log(`Example app listening on port ${process.env.PORT}!`),
    );
});

export {
    gfs
};
