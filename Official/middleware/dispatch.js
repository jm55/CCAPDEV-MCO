import * as dbPost from '../db/controller/postController.js';
import * as dbComment from '../db/controller/commentController.js';
import * as dbLike from '../db/controller/likeController.js';
import * as dbUser from '../db/controller/userController.js';
import * as dbReport from '../db/controller/reportController.js';

var postHolder = [];
var commentHolder = [];
var likeHolder = [];
var usersHolder = [];

function reset(){
    postHolder = [];
    commentHolder = [];
    likeHolder = [];
    usersHolder = [];
}

export async function purgeAccount(userId){
    
}

export async function deletePost(postHash){
    const del = await dbPost.deletePost(postHash);
    return new Promise((resolve, reject)=>{
        resolve(del);
        reject('Error deleting post!');
    });
}

export async function getEditPost(userId, postHash){
    const post = await dbPost.getPostByPostHash(postHash);
    
    return new Promise((resolve, reject)=>{
        resolve(post);
        reject("Error retrieving post for edit.");
    });
}

export async function getSinglePost(userId, postHash){
    reset();
        
    const users = await dbUser.getUserByUserID(userId);
    const posts = await dbPost.getPostByPostHash(postHash);
    const likes = await dbLike.getLikeByPostHash(postHash);
    const comments = await dbComment.getCommentByPostHash(postHash);

    var user = users[0];
    var post = posts[0];

    // if(comments.length == 0)
    //     post['comments'] = null;
    // else
    //     post['comments'] = comments;

    // if(likes.length == 0){
    //     post['likeVals'] = null;
    //     post['likes'] = 0;
    // }else{
    //     post['likeVals'] = likes;
    //     post['likes'] = likes.length;
    // }

    return new Promise((resolve, reject)=>{
        resolve([user, post, likes, comments]);
        reject("Error retrieving post.");
    });
}

export async function getReportCountByUserId(userId){
    reset();
    const report = await dbReport.reportByPostOwnerId(userId);
    return new Promise((resolve, reject)=>{
        resolve(report.length);
        reject('Error retrieving report count.');
    });
}

export async function getUserPair(currentUserId, targetUserName){
    reset();
    var currentUser = (await dbUser.getUserByUserID(currentUserId))[0];
    var targetUser = (await dbUser.getUserByUserName(targetUserName))[0];

    var currentUserReportCount = (await dbReport.reportByPostOwnerId(currentUser.userId)).length;
    var targetUserReportCount = (await dbReport.reportByPostOwnerId(targetUser.userId)).length;

    currentUser['reportCount'] = currentUserReportCount;
    targetUser['reportCount'] = targetUserReportCount;

    return new Promise((resolve, reject)=>{
        resolve([currentUser,targetUser]);
        reject('Error retrieving user pairs.');
    });
}

export async function getTempUser(){
    reset();
    const users = await dbUser.getUsers();
    return new Promise((resolve,reject)=>{
        resolve(users[0]);
        reject("Error retrieving temp user!");
    });
}

export async function getCurrentUserByUserName(username){
    reset();

    var user;
    if(username == null || username == "")
        user = await getTempUser();
    else
        user = await dbUser.getUserByUserName(username);
    return new Promise((resolve,reject)=>{
        resolve(user);
        reject("Error retrieving user!");
    });
}

export async function getCurrentUserByID(userId){
    reset();

    var user;
    if(userId == null || userId == "")
        user = await getTempUser();
    else
        user = await dbUser.getUserByUserID(userId);
    return new Promise((resolve,reject)=>{
        resolve(user[0]);
        reject("Error retrieving user!");
    });
}

export async function getProfileByUserName(username){
    reset();

    const user = await dbUser.getUserByUserName(username);
    const posts = await dbPost.getPostByUserID(user[0].userId,{},{});

    var userVal = user[0];
    
    postHolder = pushVals(posts);
    
    for(var i = 0; i < postHolder.length; i++){
        var comments = await dbComment.getCommentByPostHash(postHolder[i]['postHash']);
        //console.log(comments);
        var likes = await dbLike.getLikeByPostHash(postHolder[i]['postHash']);
        postHolder[i]['user'] = user[0];
        postHolder[i]['comments'] = comments;
        postHolder[i]['likes'] = likes.length;
        postHolder[i]['likeVals'] = likes;
    }

    const promise = new Promise((resolve,reject)=>{
        resolve([userVal,postHolder]);
        reject("Error retrieving posts of user");
    });
    return promise;
}

export async function getProfileById(userId){
    reset();

    const user = await dbUser.getUserByUserID(userId);
    const posts = await dbPost.getPostByUserID(userId,{},{});
    const reports = await dbReport.reportByPostOwnerId(userId);

    var userVal = user[0];
    
    if(reports.length == 0)
        userVal['reportCount'] = '0';
    else
        userVal['reportCount'] = reports.length + '';
    
    postHolder = pushVals(posts);
    
    for(var i = 0; i < postHolder.length; i++){
        var comments = await dbComment.getCommentByPostHash(postHolder[i]['postHash']);
        //console.log(comments);
        var likes = await dbLike.getLikeByPostHash(postHolder[i]['postHash']);
        postHolder[i]['user'] = user[0];
        postHolder[i]['comments'] = comments;
        postHolder[i]['likes'] = likes.length;
        postHolder[i]['likeVals'] = likes;
    }

    const promise = new Promise((resolve,reject)=>{
        resolve([userVal,postHolder]);
        reject("Error retrieving posts of user");
    });
    return promise;
}

export async function getHomePost(){
    reset();

    const posts = await dbPost.getPosts({},{'datetime':-1});
    const comments = await dbComment.getComments();
    const likes = await dbLike.getLikes();
    const users = await dbUser.getUsers();

    postHolder = pushVals(posts);
    commentHolder = pushVals(comments);
    likeHolder = pushVals(likes);
    usersHolder = pushVals(users);
    
    console.log('Dispatch.getHomePost(): ');
    console.log('Dispatch.postHolder: ' + postHolder.length);
    console.log("Dispatch.commentHolder: " + commentHolder.length);
    console.log("Dispatch.likeHolder: " + likeHolder.length);
    console.log("Dispatch.userHolder: " + usersHolder.length);

    appendUsernameToComments();
    appendUserToPost();
    appendCommentToPost();
    appendLikesToPost();

    return new Promise((resolve,reject)=>{
        resolve(postHolder);
        reject("Error retrieving posts for Home");
    });
}

export async function isLiked(userId, postHash){
    const like = await dbLike.isLiked(userId, postHash);
    
    var isLiked = false;
    if(like.length == 1)
        if(like[0].userId == userId && like[0].postHash == postHash)
            isLiked = true;

    return new Promise((resolve, reject)=>{
        resolve(isLiked);
        reject("Error checking like");
    });
}


/*
======================================================

INTERNAL COMPONENTS ZONE

======================================================
*/


function pushVals(object){
    var temp = [];
    for(var o of object)
        temp.push(o);
    return temp;
}

function appendUserToPost(){
    for(var p of postHolder){
        for(var u of usersHolder){
            if(p.userId == u.userId){
                p['user'] = u;
            }
        }
    }
}

function appendCommentToPost(){
    var clist = [];
    for(var p of postHolder){
        clist = [];
        for(var c of commentHolder){
            if(p.postHash == c.postHash){
                clist.push(c);
            }
        }
        p['comments'] = clist;
    }
}

function appendLikesToPostSpecific(posts, likes){
    var filteredLikes = [];
    for(var p = 0; p < posts; p++){
        filteredLikes = [];
        for(var l = 0; l < likes.length; l++){
            if(posts[p].postHash == likes[l].postHash)
                filteredLikes.push(likes[l]);
        }
        posts[p]['likeVals'] = filteredLikes;
        posts[p]['likes'] = filteredLikes.length;
    }
    return posts;
}

function appendLikesToPost(){
    var filteredLikes = [];
    for(var p = 0; p < postHolder.length; p++){
        filteredLikes = [];
        for(var l = 0; l < likeHolder.length; l++){
            if(postHolder[p].postHash == likeHolder[l].postHash)
                filteredLikes.push(likeHolder[l]);
        }
        postHolder[p]['likeVals'] = filteredLikes;
        postHolder[p]['likes'] = filteredLikes.length;
    }
}

function appendUsernameToComments(){
    var commentLength = commentHolder.length;
    for(var i = 0; i < commentLength; i++){
        commentHolder[i]['username'] = findUsernameByID(commentHolder[i].userId);
    }
}

function findUsernameByID(id){
    for(var u of usersHolder){
        if(u.userId == id)
            return u.username;
    }
}

console.log("Middleware: dispatch.js loaded!");