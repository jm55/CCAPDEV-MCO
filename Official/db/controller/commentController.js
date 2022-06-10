import { getDB } from '../conn.js';

const commentCollection = getDB().collection('comments');

/**
 * Add a comment object to the database.
 * @param {Object} comment Comment object that will be added in the database. 
 * @returns Promise of an insert result on the comments collection of the database.
 */
export function newComment(comment){
    return commentCollection.insertOne(comment); //Insert one comment object
}

/**
 * Gets all comments from the comments collection of the database.
 * Output are sorted in descending order using datetime field of the document.
 * @param {import('mongodb').FindOptions} options Filter options.
 * @returns Promise of an array of all comment objects from the database.
 */
export function getComments(options = null){
    if(options != null) //Without custom options
        return commentCollection.find({}, options).sort({'datetime':-1}).toArray();    
    return commentCollection.find({}).sort({'datetime':-1}).toArray(); //With custom options
}

/**
 * Gets all comments that belong to the post specified by its postHash.
 * @param {String} postHash postHash filter of the comments.
 * @param {Number} quantity Quantity of comments to be retrieved.
 * @param {import('mongodb').FindOptions} options Options for query/search
 * @returns Promise of an array of all comment objects that is part of the post specified by postHash.
 */
export function getCommentByPostHash(postHash, quantity, options = null){
    if(quantity == null){ //No specific quantity is set
        if(options != null)
            return commentCollection.find({'postHash':postHash}, options).sort({'datetime':-1}).toArray();
        return commentCollection.find({'postHash':postHash}).sort({'datetime':-1}).toArray();
    }else{ //Specific quantity is set
        if(options != null)
            return commentCollection.find({'postHash':postHash}, options).limit(quantity).sort({'datetime':-1}).toArray(); 
        return commentCollection.find({'postHash':postHash}).limit(quantity).sort({'datetime':-1}).toArray();
    }
}

/**
 * Delete all comments created by user specified by the userId
 * @param {String} userId User whose comments are to be deleted.
 * @returns Promise result ofthe deletion of comments in the database.
 */
 export function deleteAllCommentsByUser(userId){
    return commentCollection.deleteMany({'userId':String(userId)}); //Delete comments with user that match the userId
}

console.log("DB.Controller commentController.js loaded");