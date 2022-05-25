import express from 'express';

const homeNav = express.Router();

//FakeDB
import * as utils from '../utils/utils.js';

//Home
homeNav.get('/home', (req, res)=>{
    console.log(req.url);
    res.render("home", {
        title: "Home - Budol Finds",
        currentUser: utils.currentUser,
        posts: utils.posts,
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

//New Post
homeNav.post('/home/post', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
    try{
        console.log(req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Like Post
homeNav.post('/home/like', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
    try{
        console.log(req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Report Post
homeNav.post('/home/report', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
    try{
        console.log(req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Report Post
homeNav.post('/home/comment', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
    try{
        console.log(req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

export default homeNav;