import { getDB } from '../conn.js';

const postCollection = getDB().collection('posts');

export function checkPosts(){
    return postCollection.find({}).toArray();
}

export default{};
console.log("Module postController.js loaded");