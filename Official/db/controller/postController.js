import { getDB } from '../conn.js';

const postCollection = getDB().collection('posts');

export function checkPosts(){
    return postCollection.find({}).toArray();
}

export function addPost(post){
    return postCollection.insertOne(post);
}

console.log("DB.Controller postController.js loaded");