import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    userId: String,
    postHash: String,
    datetime: Date,
});

export const Like = mongoose.model('Like', likeSchema);