import { ObjectID } from 'mongodb';
import { getDB } from '../conn.js';

const postCollection = getDB().collection('posts');

/**
 * Adds a post object to the posts collection of the database.
 * @param {Object} post Post Object
 * @returns Promise result of an insert on the posts collection of the database.
 */
export function addPost(post){
    return postCollection.insertOne(post);
}

/**
 * Updates the post on the database.
 * @param {Object} post Post object.
 * @returns Promise result of an update on the posts collection of the database.
 */
export function updatePost(post){
    return postCollection.updateOne({'postHash':post.postHash}, {$set: post}).catch((error)=>{
        console.error(error);
    });
}

/**
 * Deletes a post on the database.
 * @param {String} postHash Post to be deleted.
 * @returns Promise result of a delete on the posts collection of the database.
 */
export function deletePost(postHash){
    return postCollection.deleteOne({'postHash':postHash});
}

/**
 * Get the posts with the specified filter and sorting parameters.
 * @param {String} page last object id retrieved which serves as the current page number
 * @param {Number} limit Number of non-user specific posts to be retrieved
 * @param {String} search Keyword filters for the posts.
 * @param {String} category Category filters for the posts.
 * @returns Promise of all filtered posts from the posts collection of the database.
 */
export function getPosts(page, limit, search, category){
    var filter = {};
    if(page != null) //If page was available, use as filter where posts less than it (i.e. previous posts) are queued next.
        filter["_id"] = {"$lt": new ObjectID(page)};
    if(search != "" || category != ""){
        if(search != "" || search != null) //Add search filter if available
            filter['description'] = {$regex: new RegExp(search, 'i')};
        if(category != "" || category != null) //Add category filter if available.
            filter['category'] =  {$regex: new RegExp(category, 'i')};
        else
            filter['category'] =  {$regex: new RegExp('None', 'i')};
    }
    return postCollection.find(filter).limit(limit).sort({'datetime':-1}).toArray();
}

/**
 * Counts the number of documents or posts in the database that is associated to the userId specified.
 * @param {String} userId User filter of the posts.
 * @returns Promise of a number of documents that belong to the user.
 */
export function getPostCount(userId){
    if(userId == null || userId == "")
        return null;
    return postCollection.countDocuments({'userId':userId});
}

/**
 * Get posts by one user, search words, and category.
 * @param {String} userId Filter parameter.
 * @param {String} search Filter parameter.
 * @param {String} page Filter parameter.
 * @param {Number} limit Filter parameter.
 * @returns Promise of all filtered posts from the posts collection of the database.
 */
export function getPostByUserID(userId, search, page, limit){
    var filter = {'userId':userId};
    if(page != null)
        filter["_id"] = {"$lt": new ObjectID(page)}; //If page was available, use as filter where posts less than it (i.e. previous posts) are queued next.
    if(search != "" || search != null)
        filter['description'] = {$regex: new RegExp(search, 'i')};
    return postCollection.find(filter).limit(limit).sort({'datetime':-1}).toArray();
}

/**
 * Get post object that is specified by postHash.
 * @param {String} postHash Filter parameter.
 * @returns Promise of one post document from the database as specified by postHash.
 */
export function getPostByPostHash(postHash){
    return postCollection.findOne({'postHash':postHash});
}

/**
 * Delete all posts created by user specified by the userId
 * @param {String} userId User whose posts are to be deleted.
 * @returns Promise result ofthe deletion of posts in the database.
 */
export function deleteAllPostsByUser(userId){
    return postCollection.deleteMany({'userId':userId});
}

console.log("DB.Controller postController.js loaded");