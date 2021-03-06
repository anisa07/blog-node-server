import mongoose, {Schema} from 'mongoose';

const labelToPostSchema = new Schema({
    labelsIds: [{type: Schema.Types.ObjectId, ref: 'Label'}],
    postId: {type: Schema.Types.ObjectId, ref: 'Post'}
 },
 {timestamps: true});
 
const LabelToPost = mongoose.model('LabelToPost', labelToPostSchema);

export {
    LabelToPost
}