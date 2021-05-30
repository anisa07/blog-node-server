import mongoose, {Schema} from 'mongoose';

export type FollowerFollowModel = mongoose.Document & {
    followId: string,
    followerId: string,
    id: string
};

const FollowerFollowSchema = new Schema({
        followId: {
            type: String,
            required: true,
        },
        followerId: {
            type: String,
            required: true,
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
