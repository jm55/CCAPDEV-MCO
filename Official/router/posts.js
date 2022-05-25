import express from 'express';

const postNav = express.Router();

//TEMPDB
import * as utils from '../utils/utils.js';

//View Specific Post
postNav.get('/post/:posthash', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
    res.render("viewpost",  {
        title: "Post - Budol Finds",
        currentUser: utils.currentUser,
        postComments: utils.getCommentToPost(utils.currentPost.posthash),
        currentPost: utils.currentPost, //SAMPLE POST
        currentPostJSON: JSON.stringify(utils.currentPost),
        helpers: {
            likes(size){return size.length;},
            simpleDateTime(dt){return dt.toLocaleDateString();}
        }
    });
});

//Edit Post
postNav.get('/post/:posthash/edit', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
    res.render("post",  {
        title: "Post - Budol Finds",
        currentUser: utils.currentUser, //SAMPLE USER
        currentPost: utils.currentPost, //SAMPLE POST
        currentPostJSON: JSON.stringify(utils.currentPost), //SAMPLE JSON POST
    });
});

//Edit Post
postNav.post('/post/:posthash/save', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
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

export default postNav;