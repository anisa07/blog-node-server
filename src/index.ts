import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import userRouter from './routes/user';
import connectDb from './dbs/mongoDb';
import redisClient from './dbs/redisDb'; 
import mongoose, { Mongoose } from 'mongoose';

redisClient.on("error", (error) => {
    console.error(`Redis error: ${error}`);
});

redisClient.on("connect", () => {
    console.log(`connect`);
});

const app = express();

app.use(cors({
    origin: process.env.ORIGIN
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRouter);

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