import express from 'express';

const debugTest = express.Router();
debugTest.use(express.json());

//Utilities
import * as format from '../middleware/formatting.js'

//DB via Dispatch
import * as dispatch from '../middleware/dispatch.js';

//Error management
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

//Root Debug Access
debugTest.all('/debug',(req,res)=>{
    redirectError(res, StatusCodes.FORBIDDEN);
});

debugTest.get('/debug/home', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);

    var userId = '1'; //UPDATE USING SESSION userId VALUE

    dispatch.getHome(userId).then((data)=>{
        if(data != null){
            res.render("home", {
                title: "Home - Budol Finds",
                currentUser: data[0],
                //likes: tempDB.likes,
                search:"",
                category:"",
                posts: data[1], //POSTS
                helpers: {
                    fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
                    simpleDateTime(dt){return format.simpleDateTime(dt);},
                    likes(like){return format.pluralInator('Like',like);},
                    btnLiked(postHash){
                        for(var p of data[1])
                            if(p.postHash == postHash)
                                for(var u of p.likeVals)
                                    if(u.userId == data[0].userId)
                                        return "Liked";
                        return "Like";
                    },
                    editable(postUserId){
                        if(postUserId == data[0].userId)
                            return "block";
                        else
                            return "none";
                    }
                }
            });
        }else{
            redirectError(res, StatusCodes.FORBIDDEN);
        }
    });
});

/** Home Search */
debugTest.get('/debug/home/search/:searchVal', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);


    
    const out = "Home Search Filter: "+req.params['searchVal'];
    console.log(out);
    res.send(out);
});

/** Profile */
// debugTest.get('/debug/profile',(req, res)=>{
//     console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    
//     var userId = '1'; //UPDATE USING SESSION userId VALUE
//     dispatch.getProfileById(userId).then((data)=>{
//         var user = data[0]
//         var posts = data[1];
//         res.render("profile",  {
//             title: format.buildTitle(user.username),
//             currentUser: user, 
//             targetUser: user,
//             posts: posts,
//             helpers: {
//                 fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
//                 simpleDateTime(dt){return format.simpleDateTime(dt);},
//                 likes(like){return format.pluralInator('Like',like);},
//                 btnLiked(postHash){
//                     for(var p of posts)
//                         if(p.postHash == postHash)
//                             for(var u of p.likeVals)
//                                 if(u.userId == user.userId)
//                                     return "Liked";
//                     return "Like";
//                 },
//                 editable(postUserId){
//                     if(postUserId == user.userId)
//                         return "block";
//                     else
//                         return "none";
//                 }
//             }
//         });
//     });
// });

/** User */
// debugTest.get('/debug/user/:username',(req, res)=>{
//     const currentUserId = '1'; //UPDATE USING SESSION userId VALUE
//     const targetUserName = req.params['username'];
//     dispatch.getUserPair(currentUserId, targetUserName).then((userPair)=>{
//         const currentUser = userPair[0];
//         const targetUser = userPair[1];
//         dispatch.getProfileById(targetUser.userId).then((data)=>{
//             const posts = data[1];
//             res.render("viewuser",  {
//                 title: format.buildTitle(targetUser.username),
//                 currentUser: currentUser,
//                 targetUser: targetUser, //PERTAINS TO A TARGET USER'S ACCOUNT
//                 posts: posts,
//                 postCount: posts.length,
//                 reportCount: targetUser['reportCount'],
//                 helpers: {
//                     fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
//                     simpleDateTime(dt){return format.simpleDateTime(dt);},
//                     likes(like){return format.pluralInator('Like',like);},
//                     btnLiked(postHash){
//                         for(var p of posts)
//                             if(p.postHash == postHash)
//                                 for(var u of p.likeVals)
//                                     if(u.userId == currentUser.userId)
//                                         return "Liked";
//                         return "Like";
//                     },
//                     editable(postUserId){
//                         if(postUserId == currentUser.userId)
//                             return "block";
//                         else
//                             return "none";
//                     }
//                 }
//             });
//         });
//     });
// });

/** Specific Post */
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

/** Edit Post */
// debugTest.get('/debug/post/:posthash/edit', (req, res)=>{
//     var userId = '1'; //UPDATE USING SESSION userId VALUE
//     //const posthash = req.params['posthash'];
//     dispatch.getCurrentUserByID(userId).then((user)=>{
//         dispatch.getEditPost(userId, req.params['posthash']).then((data)=>{
//             if(data){
//                 if(data.userId === userId){
//                     res.render("post",  {
//                         title: "Post Edit - Budol Finds",
//                         currentUser: user, //SAMPLE USER
//                         currentPost: data, //SAMPLE POST
//                         currentPostJSON: JSON.stringify(data), //SAMPLE JSON POST
//                     });
//                 }else{
//                     res.render("err", {
//                         title: "Error - Budol Finds",
//                         errID: "403",
//                         errMsg: "Post not editable to you."
//                     });
//                 }
//             }else{
//                 res.render("err", {
//                     title: "Error - Budol Finds",
//                     errID: "404",
//                     errMsg: "Nothing to see here..."
//                 });
//             }
//         });
//     });
// });

export default debugTest;
console.log("Router: debug.js loaded!");