import mongoose, { Schema } from 'mongoose';

export type LikeModel = mongoose.Document & {
  value: number,
  user: string,
  post: string
};  

const likeSchema = new Schema({
  value: {
    type: Number,
    default: 0
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
},
  { timestamps: true });

const Like = mongoose.model('Like', likeSchema);

export {
  Like
}
