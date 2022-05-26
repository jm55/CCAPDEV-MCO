import { getDB } from '../conn.js';

const likeCollection = getDB().collection('likes');

export function checkLikes(){
    return likeCollection.find({}).toArray();
}

export default{};
console.log("Module likeController.js loaded");