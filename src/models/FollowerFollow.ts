import mongoose, {Schema} from 'mongoose';

export type FollowerFollowModel = mongoose.Document & {
    followId: string,
    followerId: string,
    id: string
};

const FollowerFollowSchema = new Schema({
        followId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        followerId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        id: {
            type: String,
            required: true,
        },
    },
    {timestamps: true});

const FollowerFollow = mongoose.model('FollowerFollow', FollowerFollowSchema);

export {
    FollowerFollow
}
