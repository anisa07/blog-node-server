import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

FollowerFollowSchema.plugin(mongoosePaginate);
const FollowerFollow = mongoose.model('FollowerFollow', FollowerFollowSchema);

export {
    FollowerFollow
}
