import mongoose, {Schema} from 'mongoose';

export type CommentModel = mongoose.Document & {
  text: string,
  userId: string,
  postId: string
}

const commentSchema = new Schema({
   text: {
    type: String,
    required: true,
   },
   userId: {type: Schema.Types.ObjectId, ref: 'User'},
   postId: {type: Schema.Types.ObjectId, ref: 'Post'},
 },
 {timestamps: true});
 
const Comment = mongoose.model('Comment', commentSchema);

export {
    Comment
}
