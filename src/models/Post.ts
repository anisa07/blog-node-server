import mongoose, { Schema } from 'mongoose';

export type PostModel = mongoose.Document & {
    title: string,
    text: string,
    image: any,
    labelIds: string[],
    commentIds: string[],
    authorId: string,
    filename: string
  };  


const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String
    },
    filename: {
        type: String,
    },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    commentIds: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    labelIds: [{ type: Schema.Types.ObjectId, ref: 'Label' }],
    like: [{ type: Schema.Types.ObjectId, ref: 'Like' }]
},
    { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export {
    Post
}
