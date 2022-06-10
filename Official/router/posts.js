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
import {Post} from '../model/posts.js';
import { Like } from '../model/likes.js';

//Multer
import * as mult from '../middleware/mult.js';

//Filename Rewrite (via fs)
import * as file from '../middleware/fs.js';

//Error handling
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

//Creating postHashes
import {newPostHash} from "../middleware/hashIds.js";

//Cookies
import * as cookie from '../middleware/cookie.js';
import session from 'express-session';


postNav.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge:1000*60*60*24*30,
        httpOnly: true
    }
}));

postNav.use(express.json());

/**  View Specific Post */
postNav.get('/post/:posthash', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    var targetPostHash = reqVal.params['posthash'];
    
    var userId = cookie.getCookieUserId(reqVal.session);
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
            post: currentPost,
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
                    if(currentUser != null){
                        if(postUserId == currentUser.userId)
                            return "block";
                        else
                            return "none";
                    }else{
                        return 'none';
                    }
                },
                convertEscapeChar(text){
                    return format.convertEscapeChar(text);
                }
            }
        });
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/** Edit Post */
postNav.get('/post/:posthash/edit', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);

    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dispatch.getEditPost(userId, reqVal.params['posthash']).then((data)=>{
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
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
    
});

/** Save Edit Post */
postNav.patch('/post/:posthash/save', mult.upload_post.single('imgselect'), (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        reqVal.body['editdatetime'] = new Date();
        Post.updateOne(reqVal.body).then((result)=>{
            if(result['acknowledged']==true){
                if(reqVal.file)
                    file.renamePostImg(reqVal.file.originalname, reqVal.body["postHash"]);
                    res.sendStatus(StatusCodes.OK);
            }else
                res.sendStatus(StatusCodes.EXPECTATION_FAILED);
        }).catch((err)=>{
            console.error(err);
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
});

/** Delete Post */
postNav.delete('/post/:posthash/delete', (req, res)=>{ 
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dispatch.deletePost(reqVal.body['postHash']).then((result)=>{
            if(result.acknowledged){
                file.deletePostImg(reqVal.body['postHash']);
                res.sendStatus(StatusCodes.OK);
            }else{
                res.sendStatus(StatusCodes.EXPECTATION_FAILED);
            }
        }).catch((error)=>{
            console.error(error);
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
    
});

/** New Post */
postNav.post('/post/new', mult.upload_post.single('imgselect'), (req, res)=>{ 
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        reqVal.body["postHash"] = newPostHash();
        reqVal.body["imgurl"] = '/img/post/' + reqVal.body['postHash'] + ".webp";
        reqVal.body["datetime"] = new Date();
        
        Post.create(reqVal.body,error=>{
            if(error){
                res.sendStatus(StatusCodes.EXPECTATION_FAILED);
            }else{
                file.renamePostImg(reqVal.file.originalname, reqVal.body["postHash"]);
                res.sendStatus(StatusCodes.OK);
            }
        });
    }
});

/** Like Post */
postNav.post('/post/like', (req, res)=>{ 
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        var currentCount = Number(reqVal.body['currentCount']);
        dbLike.isLiked(reqVal.body['userId'], reqVal.body['postHash']).then((arr)=>{
            if(arr != null){
                Like.deleteOne({userId: reqVal.body['userId'], postHash: reqVal.body['postHash']}, error=>{
                    if(error){
                        res.sendStatus(StatusCodes.EXPECTATION_FAILED);
                    }else{
                        updateCounter(res,currentCount,false);
                    }
                });
                //dbLike.unlike(reqVal.body['userId'],reqVal.body['postHash']);
            }else{
                Like.create(reqVal.body, error=>{
                    if(error){
                        res.sendStatus(StatusCodes.EXPECTATION_FAILED);
                    }else{
                        updateCounter(res,currentCount,true);
                    }
                });
                //dbLike.like(reqVal.body);
            }   
        }).catch((err)=>{
            res.statusMessage = err;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
    
});

/** Report Post */
postNav.post('/post/report', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dbReport.blotterReport(req.body).then((result)=>{
            if(result.acknowledged == true)
                res.sendStatus(StatusCodes.OK);
            else
                res.sendStatus(StatusCodes.EXPECTATION_FAILED);
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }); 
    }
});

/** Post Comment */
postNav.post('/post/comment', (req, res)=>{ 
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dbComment.newComment(req.body).then((val)=>{
            if(val.acknowledged == true)
                res.sendStatus(StatusCodes.OK)
            else
                res.sendStatus(StatusCodes.EXPECTATION_FAILED);
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
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

export default postNav;
console.log("Router: posts.js loaded!");