import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type PostModel = mongoose.Document & {
    title: string,
    text: string,
    image: any,
    authorId: string,
    filename: string,
    createdAt?: any;
    updatedAt?: any;
    id: string;
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
        authorId: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    {timestamps: true});

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);

export {
    Post
}
