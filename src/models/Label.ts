import mongoose, { Schema } from 'mongoose';

export type LabelModel = mongoose.Document & {
    name: string
}

const labelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
},
    { timestamps: true }
);

const Label = mongoose.model('Label', labelSchema);

export {
    Label
}
