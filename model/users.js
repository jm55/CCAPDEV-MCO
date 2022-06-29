import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
        unique: true,
    },
    username: {
        type: String, 
        required: true,
        unique: true,
    },
    passhash: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true,
    },
    fname: {
        type: String, 
        required: true,
    },
    mname: {
        type: String, 
        required: false,
    },
    lname: {
        type: String, 
        required: true,
    },
    gender: {
        type: String, 
        required: true,
    },
    bio: {
        type: String, 
        required: false,
    },
    profilepic: {
        type: String, 
        required: true,
    },
});

export const User = mongoose.model('users', userSchema);