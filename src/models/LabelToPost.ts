import mongoose, {Schema} from 'mongoose';

export type LabelToPostModel = mongoose.Document & {
    postId: string,
    labelId: string,
    id: string
}

const labelToPostSchema = new Schema({
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        labelId: {
            type: Schema.Types.ObjectId,
            ref: 'Label'
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
