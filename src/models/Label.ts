import mongoose, {Schema} from 'mongoose';

const labelSchema = new Schema({
    label: {
        type: String,
        required: true,
        unique: true
    }
 },
 {timestamps: true});
 
const Label = mongoose.model('Label', labelSchema);

export {
    Label
}
