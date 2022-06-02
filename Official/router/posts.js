import express from 'express';

const postNav = express.Router();

//Utilities
import * as format from '../middleware/formatting.js'

//DB
import * as dbPost from '../db/controller/postController.js';
import * as dbLike from'../db/controller/likeController.js';
import * as dbComment from'../db/controller/commentController.js';
import * as dbReport from'../db/controller/reportController.js';
import * as dispatch from '../middleware/dispatch.js';

//Multer
import * as mult from '../middleware/mult.js';

//Filename Rewrite (via fs)
import * as file from '../middleware/fs.js';

//Error handling
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

//Creating postHashes
import {newPostHash} from "../middleware/hashIds.js";

postNav.use(express.json());

/** 
 *  @todo
 *  View Specific Post
 */
postNav.get('/post/:posthash', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    var targetPostHash = req.params['posthash'];
    
    /**
     * 
     * 
     * CHECK IF USER IS LOGGED IN OR NOT
     * 
     * UPDATE USERID
     * 
     * IF NOT LOGGED IN, SET USERID AS NULL
     * 
     * 
     */


    var userId = '1'; //UPDATE USING SESSION userId VALUE LEAVE AS NULL IF NOT LOGGEDIN

    dispatch.getSinglePost(userId, targetPostHash).then((data)=>{
        const currentUser = data[0];
        const currentPost = data[1];
        const currentLikes = data[2];
        const currentComments = data[3];
        res.render("viewpost",  {
            title: "Post - Budol Finds",
            currentUser: currentUser,
            comments: currentComments,
            likes: currentLikes.length,
            post: currentPost, //SAMPLE POST
            postJSON: JSON.stringify(currentPost),
            helpers: {
                fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
                simpleDateTime(dt){return format.simpleDateTime(dt);},
                likes(like){return format.pluralInator('Like',like);},
                btnLiked(postHash){
                    if(currentPost == postHash)
                        for(var u of currentPost.likeVals)
                            if(u.userId == currentUser.userId)
                                return "Liked";
                    return "Like";
                },
                editable(postUserId){
                    if(postUserId == currentUser.userId)
                        return "block";
                    else
                        return "none";
                }
            }
        });
    });
});

/**
 * @todo
 * Edit Post
 */
postNav.get('/post/:posthash/edit', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * DO USER CHECK HERE FIRST IF USER 'OWNS' THE POST.
     * 
     * SET currentPost TO POST IF USER 'OWNS' POST
     * 
     * SET currentPost TO NULL IF USER !'OWNS' POST
     * 
     * REDIRECT TO 401 IF NOT AUTHORIZED TO EDIT
     */
    var userId = '1'; //UPDATE USING SESSION userId VALUE
    dispatch.getEditPost(userId, req.params['posthash']).then((data)=>{
        if(data){
            if(data == 403){
                redirectError(res, StatusCodes.FORBIDDEN);
            }else if(data == 401){
                redirectError(res, StatusCodes.UNAUTHORIZED);
            }else{
                res.render("post",  {
                    title: "Post Edit - Budol Finds",
                    currentUser: data[0], //SAMPLE USER
                    currentPost: data[1], //SAMPLE POST
                    currentPostJSON: JSON.stringify(data[1]), //SAMPLE JSON POST
                });
            }
        }else{
            redirectError(res, StatusCodes.NOT_FOUND);
        }
    });
});

/** Edit Post */
postNav.patch('/post/:posthash/save', mult.upload_post.single('imgselect'), (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    dbPost.updatePost(req.body).then((result)=>{
        if(result['acknowledged']==true){
            if(req.file)
                file.renamePostImg(req.file.originalname, req.body["postHash"]);
                res.sendStatus(StatusCodes.OK);
        }else
            res.sendStatus(StatusCodes.EXPECTATION_FAILED);
    }).catch((err)=>{
        console.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/** Delete Post */
postNav.delete('/post/:posthash/delete', (req, res)=>{ 
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    dispatch.deletePost(req.body['postHash']).then((result)=>{
        if(result.acknowledged){
            file.deletePostImg(req.body['postHash']);
            res.sendStatus(StatusCodes.OK);
        }else{
            res.sendStatus(StatusCodes.EXPECTATION_FAILED);
        }
    }).catch((error)=>{
        console.error(error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/**
 * @todo
 * New Post
 */
postNav.post('/post/new', mult.upload_post.single('imgselect'), (req, res)=>{ 
    /**
     * 
     * CHECK IF USER IS LOGGED IN. 
     * IF SO, THEN RENDER THE PAGE BELOW, ELSE THEN REDIRECT BACK TO LOGIN.
     * 
     * REDIRECT TO ERROR 401 IF NOT LOGGED IN
     * 
     */
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    req.body["postHash"] = newPostHash();
    req.body["imgurl"] = '/img/post/' + req.body['postHash'] + ".webp";
    req.body["datetime"] = new Date();
    
    dbPost.addPost(req.body).then((p)=>{
        if(p.acknowledged==true){
            file.renamePostImg(req.file.originalname, req.body["postHash"]);
            res.sendStatus(StatusCodes.OK);
        }else{
            res.sendStatus(StatusCodes.EXPECTATION_FAILED);
        }
    }).catch((err)=>{
        res.statusMessage = err;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/**
 * @todo
 * Like Post
 */
postNav.post('/post/like', (req, res)=>{ 
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * 
     * CHECK IF USER IS LOGGED IN. 
     * IF SO, THEN RENDER THE PAGE BELOW, ELSE THEN REDIRECT BACK TO LOGIN.
     * 
     * REDIRECT TO ERROR 401 IF NOT LOGGED IN
     * 
     */
    var currentCount = Number(req.body['currentCount']);
    dbLike.isLiked(req.body['userId'], req.body['postHash']).then((arr)=>{
        if(arr != null){
            dbLike.unlike(req.body['userId'],req.body['postHash']);
            updateCounter(res,currentCount,false);
        }else{
            dbLike.like(req.body);
            updateCounter(res,currentCount,true);
        }   
    }).catch((err)=>{
        res.statusMessage = err;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/**
 * Updates the button and counter for like of the post as seen by the user.
 * @param {import('express').Response} res Response Object that called 
 * @param {Number} counter Number of likes
 * @param {Boolean} increment Whether increment or not 
 */
function updateCounter(res, counter, increment){
    var countVal = counter;
    var btn = "Liked";
    if(increment)
        countVal++;
    else{
        btn = "Like";
        countVal--;
    }
    var count = format.pluralInator("Like", countVal) + ": " + countVal;
    res.json({btn:btn,count:count});
}

/**
 * @todo
 * Report Post
 */
postNav.post('/post/report', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * 
     * CHECK IF USER IS LOGGED IN. 
     * IF SO, THEN RENDER THE PAGE BELOW, ELSE THEN REDIRECT BACK TO LOGIN.
     * 
     * REDIRECT TO ERROR 401 IF NOT LOGGED IN
     * 
     */
    //SAMPLE BODY: { userId: 1, postHash: '42069', datetime: '2022-05-31T07:01:37.495Z' }
    dbReport.blotterReport(req.body).then((result)=>{
        if(result.acknowledged == true)
            res.sendStatus(StatusCodes.OK);
        else
            res.sendStatus(StatusCodes.EXPECTATION_FAILED);
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }); 
});

/** 
 * @todo
 * Post Comment
*/
postNav.post('/post/comment', (req, res)=>{ 
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * 
     * CHECK IF USER IS LOGGED IN. 
     * IF SO, THEN RENDER THE PAGE BELOW, ELSE THEN REDIRECT BACK TO LOGIN.
     * 
     * REDIRECT TO ERROR 401 IF NOT LOGGED IN
     * 
     */
    dbComment.newComment(req.body).then((val)=>{
        if(val.acknowledged == true)
            res.sendStatus(StatusCodes.OK)
        else
            res.sendStatus(StatusCodes.EXPECTATION_FAILED);
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});


export default postNav;
console.log("Router: posts.js loaded!");