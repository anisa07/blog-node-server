import mongoose, {Schema} from 'mongoose';

export type LabelToPostModel = mongoose.Document & {
    postId: string,
    labelId: string,
    id: string
}

const labelToPostSchema = new Schema({
        postId: {
            type: String,
            required: true,
        },
        labelId: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

const LabelToPost = mongoose.model('LabelToPost', labelToPostSchema);

export {
    LabelToPost
}
