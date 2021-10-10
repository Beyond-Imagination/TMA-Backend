import mongoose from 'mongoose';
const { Schema } = mongoose;

const trendSchema = new Schema({
    id: Schema.Types.ObjectId,
    month: String,
    trends: [String,],
},
{
  timestamps: true,
});

trendSchema.statics.getMonthKey = function() {
    let now = new Date();
    return `${now.getFullYear()%100}.${now.getMonth()+1}`
}

export default mongoose.model('Trend', trendSchema);
