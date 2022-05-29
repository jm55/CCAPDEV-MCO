import express from 'express';

const postNav = express.Router();

//Utilities
import * as tempDB from '../utils/tempDB.js';
import * as format from '../utils/formatting.js'

//Multer
import * as mult from '../middleware/mult.js';

//Filename Rewrite (via fs)
import * as file from '../middleware/fs.js';

//Creating postHashes
import {newPostHash} from "../middleware/hashIds.js";

//View Specific Post
postNav.get('/post/:posthash', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + "=>" + req.url);
    res.render("viewpost",  {
        title: "Post - Budol Finds",
        currentUser: tempDB.currentUser,
        postComments: tempDB.getCommentToPost(tempDB.currentPost.posthash),
        currentPost: null,//tempDB.currentPost, //SAMPLE POST
        currentPostJSON: JSON.stringify(tempDB.currentPost),
        helpers: {
            likes(size){return size.length;},
            simpleDateTime(dt){return dt.toLocaleDateString();}
        }
    });
});

//Edit Post
postNav.get('/post/:posthash/edit', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + "=>" + req.url);
    /**
     * DO USER CHECK HERE FIRST IF USER 'OWNS' THE POST.
     * 
     * SET currentPost TO POST IF USER 'OWNS' POST
     * 
     * SET currentPost TO NULL IF USER !'OWNS' POST
     */
    res.render("post",  {
        title: "Post - Budol Finds",
        currentUser: tempDB.currentUser, //SAMPLE USER
        currentPost: tempDB.currentPost, //SAMPLE POST
        currentPostJSON: JSON.stringify(tempDB.currentPost), //SAMPLE JSON POST
    });
});

//Edit Post
postNav.patch('/post/:posthash/save', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + "=>" + req.url);
    try {
        console.log(req.body);

        /**
         * UPDATE POST HERE
         * 
         * RETURN 200 IF SUCCESSFUL
         * RETURN 500 IF NOT SUCCESSFUL
         */

        res.sendStatus(300); //NOT SURE IF NEEDED
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Delete Post
postNav.delete('/post/:posthash/delete', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + "=>" + req.url);
    try {
        console.log(req.body);

        /**
         * DELETE POST HERE
         * 
         * RETURN 200 IF SUCCESSFUL
         * RETURN 500 IF NOT SUCCESSFUL
         */

        res.sendStatus(300); //NOT SURE IF NEEDED
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//New Post
postNav.post('/post/new', mult.upload_post.single('imgselect'), (req, res)=>{ 
    /**
     * 
     * CHECK IF USER IS LOGGED IN. IF SO, THEN RENDER THE PAGE BELOW, ELSE THEN REDIRECT BACK TO LOGIN.
     * 
     */
    console.log("Request: " + req.socket.remoteAddress + "=>" + req.url);
    req.body["postHash"] = newPostHash();
    try{
        console.log(req.body); //<= Save Contents to Database
        //Renames DP image
        file.renamePostImg(req.file.originalname, req.body["postHash"]);
        res.redirect('/home');
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Like Post
postNav.post('/post/like', (req, res)=>{ 
    console.log("Request: " + req.socket.remoteAddress + "=>" + req.url);
    try{
        console.log(req.body);
        /**
         * SEND LIKE TO SERVER
         * 
         * CHECK IF LIKES CONTAIN THE SAME LIKE
         * 
         * IF REQ'S LIKE IS ALREADY THERE, DELETE THE LIKE FROM SERVER
         * IF REQ'S LIKE IS NOT THERE, WRITE THE LIKE TO SERVER
         * 
         * SEND A JSON MESSAGE CONTAINING IF BUTTON IS LIKED OR NOT AND WHAT IS THE COUNTER FOR THE POSTHASH
         */
        var countVal = 100; //RETRIEVE COUNT FROM SERVER
        var count = format.pluralInator("Like", countVal) + ": " + countVal;
        var btn = "Liked";
        res.status(200).json({btn:btn,count:count});
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Report Post
postNav.post('/post/report', (req, res)=>{ 
    console.log("Request: " + req.socket.remoteAddress + "=>" + req.url);
    try{
        console.log(req.body);

        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Report Post
postNav.post('/post/comment', (req, res)=>{ 
    console.log("Request: " + req.socket.remoteAddress + "=>" + req.url);
    try{
        console.log("Received Comment: " + req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});


export default postNav;
console.log("Router: posts.js loaded!");