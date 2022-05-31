import { getDB } from '../conn.js';

const commentCollection = getDB().collection('comments');

export function checkComments(){
    return commentCollection.find({}).toArray();
}

export function newComment(comment){
    return commentCollection.insertOne(comment);
}

console.log("DB.Controller commentController.js loaded");