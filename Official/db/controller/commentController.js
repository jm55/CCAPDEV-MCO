import { getDB } from '../conn.js';

const commentCollection = getDB().collection('comments');

export function checkComments(){
    return commentCollection.find({}).toArray();
}

export default{};
console.log("Module commentController.js loaded");