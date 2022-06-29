import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
    },
    text: {
        type: String, 
        required: true,
    },
    postHash: {
        type: String, 
        required: true,
    },
    datetime: {
        type: Date, 
        required: true,
    },
    username: {
        type: String, 
        required: true,
    },
});

export const Comment = mongoose.model('Comment', commentSchema);