import mongoose, { Schema } from 'mongoose';

export type UserModel = mongoose.Document & {
    name: string; 
    email: string; 
    password: string; 
    type: string;
    state: string;
    bio: string;
    activityId: string;
    photo: string;
  };  

export const userSchema = new Schema({
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

const User = mongoose.model<UserModel>('User', userSchema);

export {
    User
}
