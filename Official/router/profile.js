import express from 'express';

const profileNav = express.Router();

import * as tempDB from '../utils/tempDB.js';
var targetUser = tempDB.users[1];


function buildTitle(username){
    return username + " - Budol Finds"
}

//User (other User Profile)
profileNav.get('/user/:username', (req, res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    res.render("viewuser",  {
        title: buildTitle(targetUser.username),
        currentUser: tempDB.currentUser, 
        targetUser: tempDB.targetUser, //PERTAINS TO A TARGET USER'S ACCOUNT
        posts: tempDB.getPostsByAuthorID(tempDB.targetUser.userId),
        postCount: tempDB.getPostsByAuthorID(tempDB.targetUser.userId).length,
        reportCount: 0,
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

//Profile
profileNav.get('/profile', (req, res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    res.render("profile",  {
        title: buildTitle(tempDB.currentUser.username),
        currentUser: tempDB.currentUser, 
        targetUser: tempDB.currentUser,
        posts: tempDB.getPostsByAuthorID(tempDB.currentUser.userId),
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

//Profile Settings
profileNav.get('/profile/settings', (req, res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    res.render("profile_settings", {
        title: "Profile Settings - Budol Finds",
        currentUser: tempDB.currentUser,
        currentUserJSON: JSON.stringify(tempDB.currentUser),
    });
});

//Save Profile
profileNav.patch('/profile/settings/save', (req, res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    var body = req.body;
    req.body = null;
    try{
        console.log(body);
        /**
         * UPDATE PROFILE HERE
         * 
         * RETURN 200 IF SUCCESSFUL
         * RETURN 500 IF !SUCCESSFUL
         */
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Delete Profile
profileNav.delete('/profile/settings/delete', (req, res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    var body = req.body;
    req.body = null;
    try{
        console.log(body);
        /**
         * DELETE PROFILE HERE
         * 
         * RETURN 200 IF SUCCESSFUL
         * RETURN 500 IF !SUCCESSFUL
         */
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

export default profileNav;
console.log("Router: profile.js loaded!");