import { getDB } from '../conn.js';

const likeCollection = getDB().collection('likes');

export function checkLikes(){
    return likeCollection.find({}).toArray();
}

export function isLiked(userId, postHash){
    return likeCollection.find({'userId':String(userId), 'postHash':String(postHash)}).toArray();
}

export function unlike(userId, postHash){
    return likeCollection.deleteOne({'userId':String(userId), 'postHash':String(postHash)});
}

export function like(body){
    /**
     * SAMPLE:
     * userId: 1,
     * postHash: '08191',
     * datetime: '2022-05-31T04:11:12.381Z',
     * currentCount: '1'
     */
    body['userId'] = String(body['userId']);
    delete body.currentCount;
    console.log('like');
    console.log(body);
    return likeCollection.insertOne(body);
}

export async function countLikes(postHash){
    return (await likeCollection.find({'postHash':String(postHash)}).toArray()).length;
}

console.log("DB.Controller likeController.js loaded");