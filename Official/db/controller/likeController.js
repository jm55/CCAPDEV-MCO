import { getDB } from '../conn.js';

const likeCollection = getDB().collection('likes');

/**
 * Finds a like document that fits the parameters specified.
 * Projects datetime of the like object.
 * @param {String} userId User that 'suppposedly' liked the post
 * @param {String} postHash Post that is pointed by the likes.
 * @returns Promise of a like document where the like meets the parameters set.
 */
export function isLiked(userId, postHash){
    return likeCollection.findOne({'userId':String(userId), 'postHash':String(postHash)},{projection:{'datetime':1}});
}

/**
 * Unlikes a post by deleting a like record based on the parameters given.
 * @param {String} userId  User that liked the post
 * @param {String} postHash  Post that is was liked.
 * @returns Promise result of a like document being deleted.
 */
export function unlike(userId, postHash){
    return likeCollection.deleteOne({'userId':String(userId), 'postHash':String(postHash)});
}

/**
 * Likes a post by adding a like record based on the parameters given.
 * @param {String} likeObject Contents of the like 
 * @returns 
 */
export function like(likeObject){
    /**
     * SAMPLE:
     * userId: 1,
     * postHash: '08191',
     * datetime: '2022-05-31T04:11:12.381Z',
     * currentCount: '9QoOG2nLvY'
     */
    likeObject['userId'] = String(likeObject['userId']);
    // @ts-ignore
    delete likeObject.currentCount;
    // @ts-ignore
    return likeCollection.insertOne(likeObject);
}

/**
 * Gets all likes from the likes collection of the database.
 * @param {import('mongodb').FindOptions} options Filter options.
 * @returns Promise of an array of all likes on the database.
 */
export function getLikes(options=null){
    if(options != null)
        return likeCollection.find({},options).toArray();    
    return likeCollection.find({}).toArray();
}

/**
 * Gets all likes that is related to a post through the specified postHash.
 * @param {String} postHash Filter parameter.
 * @param {import('mongodb').FindOptions} options Filter options.
 * @returns Promise of an array of all the likes on the post specified by postHash.
 */
export function getLikeByPostHash(postHash, options = null){
    if(options != null)
        return likeCollection.find({'postHash':postHash}, options).toArray();
    return likeCollection.find({'postHash':postHash}).toArray();    
}

/**
 * Delete all likes created by user specified by the userId
 * @param {String} userId User whose likes are to be deleted.
 * @returns Promise result ofthe deletion of likes in the database.
 */
 export function deleteAllLikesByUser(userId){
    return likeCollection.deleteMany({'userId':userId});
}

console.log("DB.Controller likeController.js loaded");