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

/**
 * @todo
 * Delegates the deletion of an entire account and all related objects 
 * to it.
 * @param {String} userId
 * @returns Promise that contains true or false if all traces of the account is deleted in the DB. 
 */
export async function purgeAccount(userId){
    /**
     * CONDUCT PURGING OF AN ACCOUNT SPECIFIED BY USERID.
     */
}

/**
 * Delegates the deletion of the of a post.
 * @param {String} postHash Post to be deleted.
 * @returns Promise whether the post is deleted or not.
 */
export async function deletePost(postHash){
    const del = await dbPost.deletePost(postHash);
    return new Promise((resolve, reject)=>{
        resolve(del);
        reject('Error deleting post!');
    });
}

/**
 * Gets a post for editing.
 * @param {String} userId 
 * @param {String} postHash 
 * @returns Promise of a post object.
 */
export async function getEditPost(userId, postHash){
    const post = await dbPost.getPostByPostHash(postHash);
    return new Promise((resolve, reject)=>{
        resolve(post);
        reject("Error retrieving post for edit.");
    });
}

/**
 * Gets a single post for viewing.
 * @param {String} userId User that views the post (not strictly the author of the post) 
 * @param {String} postHash Post to be viewed.
 * @returns Promise of a post object.
 */
export async function getSinglePost(userId, postHash){
    reset();
    
    var users = null
    if(userId != null || userId != "")
        users = await dbUser.getUserByUserID(userId);

    const posts = await dbPost.getPostByPostHash(postHash);
    var user = users;
    var post = null;
    var likes = [];
    var comments = [];

    if(posts != null){
        post = posts;
        post['user'] = await dbUser.getUserByUserID(post.userId);
        likes = await dbLike.getLikeByPostHash(postHash);
        comments  = await dbComment.getCommentByPostHash(postHash);
    }
        
    return new Promise((resolve, reject)=>{
        resolve([user, post, likes, comments]);
        reject("Error retrieving post.");
    });
}

/**
 * Gets report count by a user as specified by the userId.
 * @param {String} userId Filter parameter 
 * @returns Promise of the count of reports of a user.
 */
export async function getReportCountByUserId(userId){
    reset();
    const report = await dbReport.reportByPostOwnerId(userId);
    return new Promise((resolve, reject)=>{
        resolve(report.length);
        reject('Error retrieving report count.');
    });
}

/**
 * Gets a user pair for both the current user and the target user for profile viewing.
 * Useful for viewing a user account of another user (and even the current user's).
 * @param {String} currentUserId userID of the user viewing the profile
 * @param {String} targetUserName username of the user profile to be viewed.
 * @returns Promise of a list containing user objects for both current and target users.
 */
export async function getUserPair(currentUserId, targetUserName){
    reset();
    var currentUser = (await dbUser.getUserByUserID(currentUserId));
    var targetUser = (await dbUser.getUserByUserName(targetUserName));

    if(targetUser == null){
        return new Promise((resolve, reject)=>{
            resolve([currentUser,null]);
            reject('Error retrieving user pairs.');
        });
    }

    var currentUserReportCount = (await dbReport.reportByPostOwnerId(currentUser.userId)).length;
    var targetUserReportCount = (await dbReport.reportByPostOwnerId(targetUser.userId)).length;

    currentUser['reportCount'] = currentUserReportCount;
    targetUser['reportCount'] = targetUserReportCount;

    return new Promise((resolve, reject)=>{
        resolve([currentUser,targetUser]);
        reject('Error retrieving user pairs.');
    });
}

/**
 * Gets a random user from database.
 * @deprecated
 * @returns Promise of a random user object. 
 */
export async function getTempUser(){
    reset();
    const users = await dbUser.getUsers();
    return new Promise((resolve,reject)=>{
        resolve(users[Math.floor(Math.random() * users.length)]);
        reject("Error retrieving temp user!");
    });
}

/**
 * Gets a user by its username
 * @param {String} username Filter parameter.
 * @returns Promise of a user object as specified by the username.
 */
export async function getCurrentUserByUserName(username){
    reset();
    var user = null;

    if(username != "" || username != null)
        user = await dbUser.getUserByUserName(username);
    
        return new Promise((resolve,reject)=>{
        resolve(user);
        reject("Error retrieving user!");
    });
}

/**
 * Gets currentUser as specified by the userId.
 * @param {String} userId Filter parameter.
 * @returns Promise of a user object as specified by the userId.
 */
export async function getCurrentUserByID(userId){
    reset();

    var user = null;
    if(userId != null || userId != "")
        user = await dbUser.getUserByUserID(userId);
        
    return new Promise((resolve,reject)=>{
        resolve(user);
        reject("Error retrieving user!");
    });
}

/**
 * Gets a complete profile list that contains the user and posts by user respectively.
 * @param {String} username Filter parameter.
 * @returns Promise of a complete profile as specified by the username.
 */
export async function getProfileByUserName(username){
    reset();

    const user = await dbUser.getUserByUserName(username);
    const posts = await dbPost.getPostByUserID(user[0].userId,"","");

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

/**
 * Gets a complete profile list that contains the user and posts by user respectively.
 * @param {String} userId Filter parameter.
 * @returns romise of a complete profile as specified by the userId.
 */
export async function getProfileById(userId){
    reset();

    const userVal = await dbUser.getUserByUserID(userId);
    const posts = await dbPost.getPostByUserID(userId,"","");
    const reports = await dbReport.reportByPostOwnerId(userId);

    if(reports.length == 0)
        userVal['reportCount'] = '0';
    else
        userVal['reportCount'] = reports.length + '';
    
    postHolder = pushVals(posts);
    
    for(var i = 0; i < postHolder.length; i++){
        var comments = await dbComment.getCommentByPostHash(postHolder[i]['postHash']);
        //console.log(comments);
        var likes = await dbLike.getLikeByPostHash(postHolder[i]['postHash']);
        postHolder[i]['user'] = userVal;
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

/**
 * Gets all posts from the database.
 * @returns Promise of all posts from DB.
 */
export async function getHomePost(){
    reset();

    const posts = await dbPost.getPosts("","");
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

/**
 * Checks if the post is liked by the user
 * @param {String} userId Filter parameter.
 * @param {String} postHash Filter parameter.
 * @returns Promise of a boolean value if the post is liked or not by the user.
 */
export async function isLiked(userId, postHash){
    const like = await dbLike.isLiked(userId, postHash);
    
    var isLiked = false;
    if(like.length == 1)
        if(like.userId == userId && like.postHash == postHash)
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