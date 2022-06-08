import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: String,
    text: String,
    postHash: String,
    datetime: Date,
    username: String,
});

export const Comment = mongoose.model('Comment', commentSchema);