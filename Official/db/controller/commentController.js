import { getDB } from '../conn.js';

const commentCollection = getDB().collection('comments');

export function checkComments(){
    return commentCollection.find({}).toArray();
}

export function newComment(comment){
    return commentCollection.insertOne(comment);
}

export function getComments(){
    return commentCollection.find({}).toArray();
}

export function getCommentByPostHash(postHash){
    return commentCollection.find({'postHash':postHash}).toArray(); 
}

console.log("DB.Controller commentController.js loaded");