import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },
    category: {
        type: String, 
        required: true,
    },
    label: {
        type: String, 
        required: true,
    },
    link: {
        type: String, 
        required: true,
    },
    imgurl: {
        type: String, 
        required: true,
    },
    postHash: {
        type: String, 
        required: true,
        unqiue: true,
    },
    datetime: {
        type: Date, 
        required: true,
    },
    editdatetime: {
        type: Date, 
        required: false,
    },
});

export const Post = mongoose.model('posts', postSchema);