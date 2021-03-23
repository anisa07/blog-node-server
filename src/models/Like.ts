import mongoose, { Schema } from 'mongoose';

export type LikeModel = mongoose.Document & {
  value: number,
  userId: string,
  postId: string
};  

const likeSchema = new Schema({
  value: {
    type: Number,
    default: 0
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
},
  { timestamps: true });

const Like = mongoose.model('Like', likeSchema);

export {
  Like
}
