import mongoose, {Schema} from 'mongoose';

export type LikeModel = mongoose.Document & {
    value: number,
    userId: string,
    postId: string,
    id: string
};

const likeSchema = new Schema({
        id: {
            type: String,
            required: true,
        },
        value: {
            type: Number,
            default: 0
        },
        userId: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true,
        },
    },
    {timestamps: true});

const Like = mongoose.model('Like', likeSchema);

export {
    Like
}
