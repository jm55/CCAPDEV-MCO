import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: String,
    description: String,
    category: String,
    label: String,
    link: String,
    imgurl: String,
    postHash: String,
    datetime: Date,
    editdatetime: Date,
});

export const Post = mongoose.model('Post', postSchema);