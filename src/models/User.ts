import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'user'
    },
    state: {
        type: String,
        default: 'active'
    },
    bio: {
        type: String,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    activityId: { type: Schema.Types.ObjectId, ref: 'Activity' }
},
    { timestamps: true });

const User = mongoose.model('User', userSchema);

export {
    User
}
