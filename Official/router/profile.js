import express from 'express';

const profileNav = express.Router();

//TEMPDB
import * as utils from '../utils/utils.js';
var targetUser = utils.users[1];


function buildTitle(username){
    return username + " - Budol Finds"
}

//User (other User Profile)
profileNav.get('/user/:userid', (req, res)=>{
    console.log(req.url);
    res.render("viewuser",  {
        title: buildTitle(targetUser.username),
        currentUser: utils.currentUser, 
        targetUser: utils.targetUser, //PERTAINS TO A TARGET USER'S ACCOUNT
        posts: utils.getPostsByAuthorID(utils.targetUser.userId),
        postCount: utils.getPostsByAuthorID(utils.targetUser.userId).length,
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
    console.log(req.url);
    res.render("profile",  {
        title: buildTitle(utils.currentUser.username),
        currentUser: utils.currentUser, 
        targetUser: utils.currentUser,
        posts: utils.getPostsByAuthorID(utils.currentUser.userId),
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
    console.log(req.url);
    res.render("profile_settings", {
        title: "Profile Settings - Budol Finds",
        currentUser: utils.currentUser,
        currentUserJSON: JSON.stringify(utils.currentUser),
    });
});

//Profile Save
profileNav.post('/profile/settings/save', (req, res)=>{
    console.log(req.url);
    try{
        console.log(req.body);

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

export default profileNav;