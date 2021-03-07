import mongoose, { Schema } from 'mongoose';

const saltSchema = new Schema({
    value: {
        type: String,
        required: true,
        unique: true
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
},
    { timestamps: true });

const Salt = mongoose.model('Salt', saltSchema);

export {
    Salt
}
