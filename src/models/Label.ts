import mongoose, {Schema} from 'mongoose';

export type LabelModel = mongoose.Document & {
    name: string,
    id: string
}

const labelSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        id: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

const Label = mongoose.model('Label', labelSchema);

export {
    Label
}
