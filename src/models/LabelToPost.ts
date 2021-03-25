import mongoose, { Schema } from 'mongoose';

export type LabelToPostModel = mongoose.Document & {
    post: string;
    label: string;
}

const labelToPostSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    label: { type: Schema.Types.ObjectId, ref: 'Label' },
},
    { timestamps: true }
);

const LabelToPost = mongoose.model('LabelToPost', labelToPostSchema);

export {
    LabelToPost
}
