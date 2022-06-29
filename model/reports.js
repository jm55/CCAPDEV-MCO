import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
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
    postOwnerId: {
        type: String, 
        required: true,
    },
});

export const Report = mongoose.model('Report', reportSchema);