import mongoose, {Schema} from 'mongoose';

export type CommentModel = mongoose.Document & {
  text: string,
  user: string,
  post: string
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
 
const Comment = mongoose.model('Comment', commentSchema);

export {
    Comment
}
