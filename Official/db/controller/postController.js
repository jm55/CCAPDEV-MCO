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
    return postCollection.updateOne({'postHash':post.postHash}, {$set: post}).then(val=>{
        console.log(val);
    }).catch((error)=>{
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
 * @param {String} search Keyword filters for the posts.
 * @param {String} category Category filters for the posts.
 * @returns Promise of all filtered posts from the posts collection of the database.
 */
export function getPosts(search, category){
    var filter = {};
    if(search != "" || category != ""){
        if(search != "" || search != null)
            filter['description'] = {$regex: search};
        
        if(category != "" || category != null)
            filter['category'] = category;
        
        return postCollection.find(filter).sort({'datetime':-1}).toArray();
    }
    return postCollection.find().sort({'datetime':-1}).toArray();
}

/**
 * @todo
 * Get posts by one user, search words, and category.
 * @param {String} userId Filter parameter.
 * @param {String} search Filter parameter.
 * @param {String} category Filter parameter.
 * @returns Promise of all filtered posts from the posts collection of the database.
 */
export function getPostByUserID(userId, search, category){
    var filter = {'userId':userId};
    /**
     * 
     * ADD SEARCH AND CATEGORY IF EITHER OF WHICH ARE !NULL.
     * 
     */
    return postCollection.find(filter).sort({'datetime':-1}).toArray();
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