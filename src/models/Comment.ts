import mongoose, {Schema} from 'mongoose';

const commentSchema = new Schema({
   text: {
    type: String,
    required: true,
   },
   userId: {type: Schema.Types.ObjectId, ref: 'User'}
 },
 {timestamps: true});
 
const Comment = mongoose.model('Comment', commentSchema);

export {
    Comment
}
