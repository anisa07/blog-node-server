import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import userRouter from './routes/user';
import connectDb from './dbs/mongoDb';
import redisClient from './dbs/redisDb';

const app = express();

redisClient.on("error", (error) => {
    console.error(`Redis error: ${error}`);
});

app.use(cors({
    origin: process.env.ORIGIN
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRouter);

connectDb().then(async () => {
    app.listen(process.env.PORT, () =>
        console.log(`Example app listening on port ${process.env.PORT}!`),
    );
});