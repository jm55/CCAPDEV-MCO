import express from 'express';

const postNav = express.Router();

//FakeDB
import * as utils from '../utils/utils.js';
utils.autoFill();
var users = utils.getUsers();
var posts = utils.getPosts();
var comments = utils.getComments();
var currentUser = users[0];

import * as userDB from '../db/controller/userController.js';

//Home
postNav.get('/home', (req, res)=>{
    console.log(req.url);
    res.render("home", {
        title: "Home - Budol Finds",
        currentUser: currentUser,
        posts: posts,
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

//Post
postNav.get('/post', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
    console.log(posts[9]);
    res.render("post",  {
        title: "Post - Budol Finds",
        currentUser: currentUser,
        currentPost: posts[9], //SAMPLE POST
        currentPostJSON: JSON.stringify(posts[9]),
    });
});

//Edit Post
postNav.post('/post/edit', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
    try{
        console.log(req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//New Post
postNav.post("/post/new", (req, res) => {
    console.log("new post received: ");
    try {
        //WRITE IMAGE TO STORAGE AS POSTHASH.WEBP
        //CHANGE IMGURL
        var newImgURL = ""; //INVOKE IMGURL AS POST'S IMGURL
        posts.push({
            author: req.body['author'],
            description: req.body['description'],
            category: req.body['category'],
            label: req.body['label'],
            link: req.body['link'],
            datetime: req.body['datetime'],
            imgurl: req.body['imgurl'],
            posthash: utils.hash(req.body['author']+req.body['description']),
            user: utils.getUser(users, req.body['author']),
            comments: [],
            likes: 0,
        });
        console.log(posts);
        res.sendStatus(200);
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Profile
postNav.get('/profile', (req, res)=>{
    console.log(req.url);
    res.render("profile",{
        title: "Profile - Budol Finds",
    });
});

//Profile Settings
postNav.get('/profile_settings', (req, res)=>{
    console.log(req.url);
    res.render("profile_settings",{
        title: currentUser.username + " - Budol Finds",
        currentUser: currentUser,
    });
});

export default postNav;