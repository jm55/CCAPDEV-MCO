import { getDB } from '../conn.js';

const commentCollection = getDB().collection('comments');

/**
 * Add a comment object to the database.
 * @param {Object} comment Comment object that will be added in the database. 
 * @returns Promise of an insert result on the comments collection of the database.
 */
export function newComment(comment){
    return commentCollection.insertOne(comment);
}

/**
 * Gets all comments from the comments collection of the database.
 * @returns Promise of an array of all comment objects from the database.
 */
export function getComments(){
    return commentCollection.find({}).sort({'datetime':-1}).toArray();
}

/**
 * Gets all comments that belong to the post specified by its postHash.
 * @param {String} postHash postHash filter of the comments.
 * @param {Number} quantity Quantity of comments to be retrieved.
 * @returns Promise of an array of all comment objects that is part of the post specified by postHash.
 */
export function getCommentByPostHash(postHash, quantity){
    if(quantity == null)
        return commentCollection.find({'postHash':postHash}).sort({'datetime':-1}).toArray();
    else
    return commentCollection.find({'postHash':postHash}).limit(quantity).sort({'datetime':-1}).toArray(); 
}

/**
 * Delete all comments created by user specified by the userId
 * @param {String} userId User whose comments are to be deleted.
 * @returns Promise result ofthe deletion of comments in the database.
 */
 export function deleteAllCommentsByUser(userId){
    return commentCollection.deleteMany({'userId':userId});
}

console.log("DB.Controller commentController.js loaded");