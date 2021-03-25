import mongoose, { Schema } from 'mongoose';

export type PostModel = mongoose.Document & {
    title: string,
    text: string,
    image: any,
    author: string,
    filename: string,
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
    author: { type: Schema.Types.ObjectId, ref: 'User' },
},
    { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export {
    Post
}
