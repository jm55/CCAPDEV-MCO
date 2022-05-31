import { getDB } from '../conn.js';

const commentCollection = getDB().collection('comments');

export function checkComments(){
    return commentCollection.find({}).toArray();
}

console.log("DB.Controller commentController.js loaded");