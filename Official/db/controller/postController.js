import { getDB } from '../conn.js';

const postCollection = getDB().collection('posts');

export function checkPosts(){
    return postCollection.find({}).toArray();
}

export function addPost(post){
    return postCollection.insertOne(post);
}

export function getPosts(filter, sort){
    /**
     * FILTER CONTAINS THE FF.: DESCRIPTION AND CATEGORY
     */
    return postCollection.find(filter).sort(sort).toArray();
}
export function getPostByUserID(userId, filter, sort){
    if(sort == null){
        sort = {'datetime':-1};
    }
    if(filter == null){
        filter = {'userId': userId};
    }else{
        filter['userId'] = userId;
    }
    return postCollection.find(filter).sort(sort).toArray();
}

console.log("DB.Controller postController.js loaded");