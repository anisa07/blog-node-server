import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type CommentModel = mongoose.Document & {
    text: string,
    userId: string,
    postId: string,
    createdAt?: any,
    updatedAt?: any,
    id: string,
}

const commentSchema = new Schema({
        text: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        id: {
            type: String,
            required: true,
        },
    },
    {timestamps: true});

commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('Comment', commentSchema);

export {
    Comment
}
