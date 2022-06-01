import { getDB } from '../conn.js';

const postCollection = getDB().collection('posts');

export function checkPosts(){
    return postCollection.find({}).toArray();
}

export function addPost(post){
    return postCollection.insertOne(post);
}

export function updatePost(post){
    return postCollection.updateOne({'postHash':post.postHash}, {$set: post}).then(val=>{
        console.log(val);
    }).catch((error)=>{
        console.error(error);
    });
}

export function deletePost(postHash){
    return postCollection.deleteOne({'postHash':postHash});
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
    }else
        sort['datetime'] = -1;
    if(filter == null){
        filter = {'userId': userId};
    }else{
        filter['userId'] = userId;
    }
    return postCollection.find(filter).sort(sort).toArray();
}

export function getPostByPostHash(postHash){
    return postCollection.find({'postHash':postHash}).toArray();
}

console.log("DB.Controller postController.js loaded");