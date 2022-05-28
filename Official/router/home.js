import express from 'express';

const homeNav = express.Router();

//TempDB
import * as tempDB from '../utils/tempDB.js';

//Multer
import * as mult from '../middleware/mult.js';

//Creating postHashes
import {newPostHash} from "../middleware/hashIds.js";

//File Renaming (cannot bypass Multer issue of not being able to name file prior to call.)
import fs from 'fs';

//Home
homeNav.get('/home', (req, res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    /**
     * 
     * CHECK IF USER IS LOGGED IN. IF SO, THEN RENDER THE PAGE BELOW, ELSE THEN REDIRECT BACK TO LOGIN.
     * 
     */
    res.render("home", {
        title: "Home - Budol Finds",
        currentUser: tempDB.currentUser,
        currentUserId   : tempDB.currentUser.userId,
        posts: tempDB.posts,
        helpers: {
            fullName(fname, mname, lname){return lname + ", " + fname + " " + mname.substring(0,1) + "."},
            simpleDateTime(dt){return dt.toLocaleDateString();},
            likes(like){
                if(like > 1)
                    return "Likes: " + like;
                else
                    return "Like: " + like;
            }
        }
    });
});

import * as file from '../middleware/fs.js';

//New Post
homeNav.post('/home/post', mult.upload_post.single('imgselect'), (req, res)=>{ 
    /**
     * 
     * CHECK IF USER IS LOGGED IN. IF SO, THEN RENDER THE PAGE BELOW, ELSE THEN REDIRECT BACK TO LOGIN.
     * 
     */
    console.log(req.socket.remoteAddress + ": " + req.url);
    req.body["postHash"] = newPostHash();
    try{
        console.log(req.body); //<= Save Contents to Database

        //Renames DP image
        file.renamePostImg(req.file.originalname, req.body["postHash"]);

        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Like Post
homeNav.post('/home/like', (req, res)=>{ 
    console.log(req.socket.remoteAddress + ": " + req.url);
    try{
        console.log(req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Report Post
homeNav.post('/home/report', (req, res)=>{ 
    console.log(req.socket.remoteAddress + ": " + req.url);
    try{
        console.log(req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Report Post
homeNav.post('/home/comment', (req, res)=>{ 
    console.log(req.socket.remoteAddress + ": " + req.url);
    try{
        console.log(req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

export default homeNav;
console.log("Router: home.js loaded!");