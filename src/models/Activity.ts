import mongoose, {Schema} from 'mongoose';

const activitySchema = new Schema({
   userId: {type: Schema.Types.ObjectId, ref: 'User'},
   commentIds: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
   followIds: [{type: Schema.Types.ObjectId, ref: 'User'}],
 },
 {timestamps: true});
 
const Activity = mongoose.model('Activity', activitySchema);

export {
    Activity
}
