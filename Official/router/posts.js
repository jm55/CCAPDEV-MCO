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

//Creating postHashes
import {newPostHash} from "../middleware/hashIds.js";

postNav.use(express.json());

//View Specific Post
postNav.get('/post/:posthash', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    var targetPostHash = req.params['posthash'];
    
    var userId = '1'; //UPDATE USING SESSION userId VALUE

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

//Edit Post
postNav.get('/post/:posthash/edit', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * DO USER CHECK HERE FIRST IF USER 'OWNS' THE POST.
     * 
     * SET currentPost TO POST IF USER 'OWNS' POST
     * 
     * SET currentPost TO NULL IF USER !'OWNS' POST
     */
    var userId = '1'; //UPDATE USING SESSION userId VALUE
    dispatch.getCurrentUserByID(userId).then((user)=>{
        dispatch.getEditPost(userId, req.params['posthash']).then((data)=>{
            if(data[0].userId === userId){
                res.render("post",  {
                    title: "Post Edit - Budol Finds",
                    currentUser: user, //SAMPLE USER
                    currentPost: data[0], //SAMPLE POST
                    currentPostJSON: JSON.stringify(data[0]), //SAMPLE JSON POST
                });
            }else{
                res.render("err", {
                    title: "Error - Budol Finds",
                    errID: "403",
                    errMsg: "Post not editable to you."
                });
            }
        });
    });
});

//Edit Post
postNav.patch('/post/:posthash/save', mult.upload_post.single('imgselect'), (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    dbPost.updatePost(req.body).then((p)=>{
        if(req.file)
            file.renamePostImg(req.file.originalname, req.body["postHash"]);
        res.sendStatus(200);
    }).catch((err)=>{
        console.error(err);
        res.sendStatus(500);
    });
});

//Delete Post
postNav.delete('/post/:posthash/delete', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    dispatch.deletePost(req.body['postHash']).then((result)=>{
        console.log(result);
        file.deletePostImg(req.body['postHash']);
        res.sendStatus(200);
    }).catch((error)=>{
        console.error(error);
        res.sendStatus(500);
    });
});

//New Post
postNav.post('/post/new', mult.upload_post.single('imgselect'), (req, res)=>{ 
    /**
     * 
     * CHECK IF USER IS LOGGED IN. 
     * IF SO, THEN RENDER THE PAGE BELOW, ELSE THEN REDIRECT BACK TO LOGIN.
     * 
     */
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    req.body["postHash"] = newPostHash();
    req.body["imgurl"] = '/img/post/' + req.body['postHash'] + ".webp";
    req.body["datetime"] = new Date();
    try{
        dbPost.addPost(req.body).then((p)=>{
            file.renamePostImg(req.file.originalname, req.body["postHash"]);
            res.sendStatus(200);
        }).catch((err)=>{
            console.error(err);
            res.sendStatus(500);
        });
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Like Post
postNav.post('/post/like', (req, res)=>{ 
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    try{
        console.log(req.body);
        /**
         * SAMPLE:
         * userId: 1,
         * postHash: '08191',
         * datetime: '2022-05-31T04:11:12.381Z',
         * currentCount: '1'
         */
        var currentCount = Number(req.body['currentCount']);
        dbLike.isLiked(req.body['userId'], req.body['postHash']).then((arr)=>{
            /**
             * SAMPLE arr:
             * _id: new ObjectId("6295991a5b87f2fa73565a12"),
             * userId: '1',
             * postHash: '42069',
             * datetime: '2022-05-31T04:26:30.532Z'
             */
            console.log('arr');
            console.log(arr);
            if(arr.length > 0){
                console.log("Already liked!");
                dbLike.unlike(req.body['userId'],req.body['postHash']);
                updateCounter(res,currentCount,false);
            }else{
                console.log("Not yet liked!");
                dbLike.like(req.body);
                updateCounter(res,currentCount,true);
            }   
        });
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

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
    
    res.status(200).json({btn:btn,count:count});
}

//Report Post
postNav.post('/post/report', (req, res)=>{ 
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    try{
        console.log(req.body);
        //SAMPLE BODY: { userId: 1, postHash: '42069', datetime: '2022-05-31T07:01:37.495Z' }
        dbReport.blotterReport(req.body).catch((error)=>{
            console.error(error);
        });
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Report Post
postNav.post('/post/comment', (req, res)=>{ 
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    try{
        dbComment.newComment(req.body).then((val)=>{
            console.log("newComment: " + val.acknowledged);
        }).catch((error)=>{
            console.log()
            console.error(error);
        })
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});


export default postNav;
console.log("Router: posts.js loaded!");