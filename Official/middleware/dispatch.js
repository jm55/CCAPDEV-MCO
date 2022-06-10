import * as dbPost from '../db/controller/postController.js';
import * as dbComment from '../db/controller/commentController.js';
import * as dbLike from '../db/controller/likeController.js';
import * as dbUser from '../db/controller/userController.js';
import * as dbReport from '../db/controller/reportController.js';

//dotenv
import 'dotenv/config';

var postHolder = [];

function reset(){
    postHolder = [];
}

/**
 * Retrieves posts by page, quantity, search, and category
 * @param {String} page ObjectId of the latest post retrieved.
 * @param {Number} quantity Quantity of posts to be returned
 * @param {String} search Search filter 
 * @param {String} category Category filter
 * @param {String} userId User associated to the posts.
 * @returns Promise of a list containing user, posts, newPage, and postCount respectively.
 */
export async function getPosts(page, quantity, search, category, userId){
    reset();
    if(userId == null  || userId == ""){
        return new Promise((resolve, reject)=>{
            resolve(null);
            reject('Error resolving promise');
        });
    }
    const user = await getUserByID(userId);
    
    //Check if user is valid such that it the userId exists in the database.
    if(user != null){
        const postCount = await dbPost.getPostCount(userId);
        const posts = await dbPost.getPosts(page,quantity,search,category);
        var newPage = null;
        if(posts.length > 0)
            newPage = posts[posts.length-1]['_id'];

        for(var i = 0; i < posts.length; i++){
            posts[i]['comments'] = await dbComment.getCommentByPostHash(posts[i].postHash, Number(process.env.COMMENT_LIMIT),
                                                                        {projection: {'userId':1,'text':1,'datetime':1,'username':1}});
            posts[i]['likeVals'] = await dbLike.getLikeByPostHash(posts[i].postHash, {projection: {'userId':1,'datetime':1}});
            posts[i]['likes'] = posts[i]['likeVals'].length;
            posts[i]['user'] = await getUserByID(posts[i].userId, {projection: {'userId':1,'profilepic':1,'username':1}});
        }

        return new Promise((resolve,reject)=>{
            resolve([user, posts, newPage, postCount]);
            reject("Error retrieving posts for Home");
        });
    }else
        return new Promise((resolve, reject)=>{
            resolve(null);
            reject('Error retrieving user');
        });
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
    var post = null;
    const user = await getUserByID(userId,{projection:{'userId':1, 'profilepic':1}});
    if(user == null){
        return new Promise((resolve, reject)=>{
            resolve('401');
            reject('Error resolving promise');
        });
    }else{
        post = await dbPost.getPostByPostHash(postHash);
        if(post.userId == userId)
            return new Promise((resolve, reject)=>{
                resolve([user, post]);
                reject('Error retrieving post');
            });
    }
    return new Promise((resolve, reject)=>{
        resolve('403');
        reject('Error resolving promise');
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
        users = await getUserByID(userId);

    const posts = await dbPost.getPostByPostHash(postHash);
    var user = users;
    var post = null;
    var likes = [];
    var comments = [];

    if(posts != null){
        post = posts;
        post['user'] = await getUserByID(post.userId);
        likes = await dbLike.getLikeByPostHash(postHash);
        comments  = await dbComment.getCommentByPostHash(postHash,null);
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
    var currentUser = (await getUserByID(currentUserId));
    var targetUser = (await getUserByUserName(targetUserName));

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
 * Gets a list of all users. It strips down the passhashes of each before returning.
 * @returns List of all users
 */
export async function getUsers(){
    var users = await dbUser.getUsers();
    for(var i = 0; i < users.length; i++)
        delete users[i]['passhash']
    return users;
}

/**
 * Gets a user by its username. It strips out the passhash from the output for security reasons.
 * @param {String} username Filter parameter.
 * @param {import('mongodb').FindOptions} options Filter options for retreiving data. 
 * @returns Promise of a user object as specified by the username.
 */
export async function getUserByUserName(username, options = null){
    reset();
    var user = null;

    if(username != "" || username != null)
        user = await dbUser.getUserByUserName(username, options);
    
        return new Promise((resolve,reject)=>{
        resolve(user);
        reject("Error retrieving user!");
    });
}

/**
 * Gets currentUser as specified by the userId. It strips out the passhash from the output for security reasons.
 * @param {String} userId Filter parameter.
 * @param {import('mongodb').FindOptions} options Filter options for retreiving data. 
 * @returns Promise of a user object as specified by the userId.
 */
export async function getUserByID(userId, options=null){
    reset();

    var user = null;
    if(userId != null || userId != "")
        user = await dbUser.getUserByUserID(userId, options);
        
    return new Promise((resolve,reject)=>{
        resolve(user);
        reject("Error retrieving user!");
    });
}

/**
 * Gets a complete profile list that contains the user and posts by user respectively.
 * @param {String} userId Filter parameter.
 * @returns Promise of a complete profile as specified by the userId.
 */
export async function getProfileById(page, quantity, search, userId){
    reset();
    const userVal = await getUserByID(userId);
    const posts = await dbPost.getPostByUserID(userId,search,page,quantity);
    const reports = await dbReport.reportByPostOwnerId(userId);
    const postCount = await dbPost.getPostCount(userId);

    for(var i = 0; i < posts.length; i++){
        posts[i]['comments'] = await dbComment.getCommentByPostHash(posts[i].postHash, Number(process.env.COMMENT_LIMIT));
        posts[i]['likeVals'] = await dbLike.getLikeByPostHash(posts[i].postHash);
        posts[i]['likes'] = posts[i]['likeVals'].length;
        posts[i]['user'] = await getUserByID(posts[i].userId);
    }
    
    var newPage = null;
    if(posts.length > 0)
        newPage = posts[posts.length-1]['_id'];

    if(reports.length == 0)
        userVal['reportCount'] = '0';
    else
        userVal['reportCount'] = reports.length + '';
    
    for(var i = 0; i < postHolder.length; i++){
        var comments = await dbComment.getCommentByPostHash(postHolder[i]['postHash'], Number(process.env.COMMENT_LIMIT));
        //console.log(comments);
        var likes = await dbLike.getLikeByPostHash(postHolder[i]['postHash']);
        postHolder[i]['user'] = userVal;
        postHolder[i]['comments'] = comments;
        postHolder[i]['likes'] = likes.length;
        postHolder[i]['likeVals'] = likes;
    }

    const promise = new Promise((resolve,reject)=>{
        resolve([userVal,posts,newPage,postCount]);
        reject("Error retrieving posts of user");
    });
    return promise;
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

/**
 * Delegates the deletion of traces of user from the database.
 * @param {String} userId 
 */
export async function deleteAccount(userId){
    const postList = await dbPost.getPostByUserID(userId, "", null, 0);
    const reportResult = await dbReport.deleteByUserID(userId);
    const likeResult = await dbLike.deleteAllLikesByUser(userId);
    const commentResult = await dbComment.deleteAllCommentsByUser(userId);
    const postResult = await dbPost.deleteAllPostsByUser(userId);
    const userResult = await dbUser.deleteUser(userId);
    return new Promise((resolve, reject)=>{
        resolve([userId,postList]);
        reject('Error deleting user.');
    });
}

console.log("Middleware: dispatch.js loaded!");