import mongoose, { Schema } from 'mongoose';

export type UserModel = mongoose.Document & {
    name: string; 
    email: string; 
    password: string; 
    type: USER_TYPE;
    state: STATE;
    bio: string;
    activityId: string;
    photo: any;
    filename: string;
    followersIds: string[];
    followIds: string[];
    newPostToReadIds: string[];
  };  

export enum STATE {
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
    DELETED = 'DELETED'
}

export enum USER_TYPE {
    SUPER = 'SUPER',
    USER = 'USER'
}

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
        default: USER_TYPE.USER
    },
    state: {
        type: String,
        default: STATE.ACTIVE
    },
    bio: {
        type: String,
    },
    filename: {
        type: String
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    activityId: { type: Schema.Types.ObjectId, ref: 'Activity' },
    followersId: { type: Schema.Types.ObjectId, ref: 'User' },
    followIds: { type: Schema.Types.ObjectId, ref: 'User' },
    newPostToReadIds: { type: Schema.Types.ObjectId, ref: 'Post' },
},
    { timestamps: true });

const User = mongoose.model<UserModel>('User', userSchema);

export {
    User
}
