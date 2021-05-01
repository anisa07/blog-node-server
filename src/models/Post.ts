import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type PostModel = mongoose.Document & {
    title: string,
    text: string,
    image: any,
    author: string,
    filename: string,
    createdAt?: any;
    updatedAt?: any;
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

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);

export {
    Post
}
