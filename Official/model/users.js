import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: String,
    username: String,
    passhash: String,
    email: String,
    fname: String,
    mname: String,
    lname: String,
    gender: String,
    bio: String,
    profilepic: String,
});

export const User = mongoose.model('User', userSchema);