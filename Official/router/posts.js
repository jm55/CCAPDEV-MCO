import express from 'express';

const postNav = express.Router();

import * as tempDB from '../utils/tempDB.js';
import * as file from '../middleware/fs.js';

//View Specific Post
postNav.get('/post/:posthash', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.socket.remoteAddress + ": " + req.url);
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
    console.log(req.socket.remoteAddress + ": " + req.url);
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
    console.log(req.socket.remoteAddress + ": " + req.url);
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
    console.log(req.socket.remoteAddress + ": " + req.url);
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

export default postNav;
console.log("Router: posts.js loaded!");