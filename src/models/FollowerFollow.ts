import mongoose, { Schema } from 'mongoose';

export type FollowerFollowModel = mongoose.Document & {
  follow: string;
  follower: string;
};  

const FollowerFollowSchema = new Schema({
  follow: { type: Schema.Types.ObjectId, ref: 'User' },
  follower: { type: Schema.Types.ObjectId, ref: 'User' },
},
  { timestamps: true });

const FollowerFollow = mongoose.model('FollowerFollow', FollowerFollowSchema);

export {
  FollowerFollow
}
