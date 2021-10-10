import mongoose from 'mongoose';
const { Schema } = mongoose;

const suggestionSchema = new Schema({
    sn: { type: Number, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    content: { type: String, default : null },
    topic: { type: [String], default : null },
    registeredAt: { type: Date, required: true },
    hashtags: { type: [String], default: [] }
},
{
    timestamps: true,
});

export default mongoose.model('Suggestion', suggestionSchema);
