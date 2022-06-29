import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    userId: {
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
});

export const Like = mongoose.model('likes', likeSchema);