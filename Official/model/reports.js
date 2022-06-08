import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    userId: String,
    postHash: String,
    datetime: Date,
    postOwnerId: String,
});

export const Report = mongoose.model('Report', reportSchema);