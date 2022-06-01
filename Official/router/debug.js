import express from 'express';

const debugTest = express.Router();

//Utilities
import * as format from '../middleware/formatting.js'

//DB
import * as dispatch from '../middleware/dispatch.js';

//Home
debugTest.get('/debug/home', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    
    var userId = 'W9qVzg2GGZ'; //UPDATE USING SESSION userId VALUE
    
    dispatch.getCurrentUserByID(userId).then((userdata)=>{
        var user = userdata;
        dispatch.getHomePost().then((posts)=>{
            res.render("home", {
                title: "Home - Budol Finds",
                currentUser: user,
                posts: posts, //POSTS
                helpers: {
                    fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
                    simpleDateTime(dt){return format.simpleDateTime(dt);},
                    likes(like){return format.pluralInator('Like',like);},
                    btnLiked(postHash){
                        for(var p of posts)
                            if(p.postHash == postHash)
                                for(var u of p.likeVals)
                                    if(u.userId == user.userId)
                                        return "Liked";
                        return "Like";
                    },
                    editable(postUserId){
                        if(postUserId == user.userId)
                            return "block";
                        else
                            return "none";
                    }
                }
            });
        });
    });
    //res.send("Debugging Home");
});

//Profile/Target Search
debugTest.get('/debug/home/search/:searchVal', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);


    
    const out = "Home Search Filter: "+req.params['searchVal'];
    console.log(out);
    res.send(out);
});

//Profile
debugTest.get('/debug/profile',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    
    var userId = '1'; //UPDATE USING SESSION userId VALUE
    dispatch.getProfileById(userId).then((data)=>{
        var user = data[0]
        var posts = data[1];
        res.render("profile",  {
            title: format.buildTitle(user.username),
            currentUser: user, 
            targetUser: user,
            posts: posts,
            helpers: {
                fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
                simpleDateTime(dt){return format.simpleDateTime(dt);},
                likes(like){return format.pluralInator('Like',like);},
                btnLiked(postHash){
                    for(var p of posts)
                        if(p.postHash == postHash)
                            for(var u of p.likeVals)
                                if(u.userId == user.userId)
                                    return "Liked";
                    return "Like";
                },
                editable(postUserId){
                    if(postUserId == user.userId)
                        return "block";
                    else
                        return "none";
                }
            }
        });
    });
});

//User
debugTest.get('/debug/user/:username',(req, res)=>{
    const currentUserId = '1'; //UPDATE USING SESSION userId VALUE
    const targetUserName = req.params['username'];
    dispatch.getUserPair(currentUserId, targetUserName).then((userPair)=>{
        const currentUser = userPair[0];
        const targetUser = userPair[1];
        dispatch.getProfileById(targetUser.userId).then((data)=>{
            const posts = data[1];
            res.render("viewuser",  {
                title: format.buildTitle(targetUser.username),
                currentUser: currentUser,
                targetUser: targetUser, //PERTAINS TO A TARGET USER'S ACCOUNT
                posts: posts,
                postCount: posts.length,
                reportCount: targetUser['reportCount'],
                helpers: {
                    fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
                    simpleDateTime(dt){return format.simpleDateTime(dt);},
                    likes(like){return format.pluralInator('Like',like);},
                    btnLiked(postHash){
                        for(var p of posts)
                            if(p.postHash == postHash)
                                for(var u of p.likeVals)
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
});

//Posthash
debugTest.get('/debug/post/:posthash', (req, res)=>{
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

//POST EDIT
debugTest.get('/debug/post/:posthash/edit', (req, res)=>{
    var userId = '1'; //UPDATE USING SESSION userId VALUE
    dispatch.getCurrentUserByID(userId).then((user)=>{
        dispatch.getEditPost(req.params['posthash']).then((data)=>{
            var post = data[0];
            if(post.userId == userId){
                res.render("post",  {
                    title: "Post - Budol Finds",
                    currentUser: user, //SAMPLE USER
                    currentPost: post, //SAMPLE POST
                    currentPostJSON: JSON.stringify(post), //SAMPLE JSON POST
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

export default debugTest;
console.log("Router: debug.js loaded!");