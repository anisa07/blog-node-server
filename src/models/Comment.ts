import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type CommentModel = mongoose.Document & {
    text: string,
    user: string,
    post: string,
    createdAt?: any;
    updatedAt?: any;
}

const commentSchema = new Schema({
        text: {
            type: String,
            required: true,
        },
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        post: {type: Schema.Types.ObjectId, ref: 'Post'},
    },
    {timestamps: true});

commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('Comment', commentSchema);

export {
    Comment
}
