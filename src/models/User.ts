import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type UserModel = mongoose.Document & {
    name: string;
    email: string;
    password: string;
    type: USER_TYPE;
    state: STATE;
    bio: string;
    photo: any;
    filename: string;
    lastReviewDate: any;
    id: string;
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
        id: {
            type: String,
            required: true,
        },
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
        lastReviewDate: {
            type: Date
        },
    },
    {timestamps: true}
);

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

export {
    User
}
