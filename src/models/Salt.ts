import mongoose, {Schema} from 'mongoose';

export type SaltModel = mongoose.Document & {
    value: string,
    userId: string,
    id: string
};

const saltSchema = new Schema({
        value: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        id: {
            type: String,
            required: true,
        },
    },
    {timestamps: true});

const Salt = mongoose.model<SaltModel>('Salt', saltSchema);

export {
    Salt
}
