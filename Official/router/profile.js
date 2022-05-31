import express from 'express';

const profileNav = express.Router();

//Utilities
import * as tempDB from '../utils/tempDB.js';
import * as format from '../utils/formatting.js';
var targetUser = tempDB.users[1];

//Multer and File
import * as mult from '../middleware/mult.js';
import * as file from '../middleware/fs.js';

//dotenv
import 'dotenv/config';

//bcrypt
import bcrypt from 'bcrypt';

function buildTitle(username){
    return username + " - Budol Finds"
}

//User (other User Profile)
profileNav.get('/user/:username', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    res.render("viewuser",  {
        title: buildTitle(targetUser.username),
        currentUser: tempDB.currentUser,
        targetUser: tempDB.targetUser, //PERTAINS TO A TARGET USER'S ACCOUNT
        posts: tempDB.getPostsByAuthorID(tempDB.targetUser.userId),
        postCount: tempDB.getPostsByAuthorID(tempDB.targetUser.userId).length,
        reportCount: 0,
        helpers: {
            fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
            simpleDateTime(dt){return format.simpleDateTime(dt);},
            likes(like){return format.pluralInator('Like',like);},
            btnLiked(postHash){
                if(tempDB.isLiked(tempDB.currentUser.userId,postHash))
                    return "Liked";
                return "Like";
            }
        }
    });
});

//Profile
profileNav.get('/profile', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    res.render("profile",  {
        title: buildTitle(tempDB.currentUser.username),
        currentUser: tempDB.currentUser, 
        targetUser: tempDB.currentUser,
        posts: tempDB.getPostsByAuthorID(tempDB.currentUser.userId),
        helpers: {
            fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
            simpleDateTime(dt){return format.simpleDateTime(dt);},
            likes(like){return format.pluralInator('Like',like);},
            btnLiked(postHash){
                if(tempDB.isLiked(tempDB.currentUser.userId,postHash))
                    return "Liked";
                return "Like";
            },
            editable(postUserId){
                if(postUserId == tempDB.currentUser.userId)
                    return "block";
                else
                    return "none";
            }
        }
    });
});

//Profile Settings
profileNav.get('/profile/settings', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    res.render("profile_settings", {
        title: "Profile Settings - Budol Finds",
        currentUser: tempDB.currentUser,
        currentUserJSON: JSON.stringify(tempDB.currentUser),
    });
});

//Save Profile
profileNav.patch('/profile/settings/save', mult.upload_dp.single('profilepic-select'), (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    try{
        console.log("body:");
        console.log(req.body);
        console.log("file:");
        console.log(req.file);
        /**
         * UPDATE PROFILE HERE
         * 
         * 2. VALIDATE CURRENT PASSWORD THROUGH '/validate/password'
         * 3. IF BODY CONTAINS PASSWORD_A AND PASSWORD_B THEN APPLY PASSWORD TO DB VIA BCRYPT
         * 4. IF FILE IS NULL THEN RETAIN IMAGE, ELSE THEN DELETE CURRENT FILE AND APPLY THE FILE ATTACHMENT AS NEW DP.
         * 
         * RETURN 200 IF SUCCESSFUL
         * RETURN 500 IF !SUCCESSFUL
         */
        if(tempDB.isMatch(req.body['username'], req.body['password_current'])){
            if(String(req.body['password_a']).length > 0 && String(req.body['password_b'])){
                if(String(req.body['password_a'])===String(req.body['password_b'])){
                    bcrypt.hash(req.body['password_b'],Number(process.env.SALT_ROUNDS),(error, hash)=>{
                        if(error != null)
                            res.sendStatus(500);
                        req.body['passhash'] = hash;
                        req.body['password_current'] = req.body['password_a'] = req.body['password_b'] = null;
                        if(req.file)
                            req.body['profilepic'] = dpUpdate(req.file.originalname,req.body["userId"]);
                        console.log(req.body); //UPLOAD TO DB
                    });
                }else{
                    //NEW PASSWORDS NOT EQUAL
                    res.sendStatus(400);
                }
            }else{
                //SKIP PASSWORDS AND UPLOAD VALUES
                if(req.file)
                    req.body['profilepic'] = dpUpdate(req.file.originalname,req.body["userId"]);
                console.log(req.body); //UPLOAD TO DB
            }
        }else
            res.sendStatus(403);
        res.sendStatus(200);
    }catch(e){
        res.sendStatus(500);
    }
});

function dpUpdate(originalname, userid){
    file.renameDP(originalname,userid);
    return process.env.DP_PUBLIC + userid + ".webp";
}

//Delete Profile
profileNav.delete('/profile/settings/delete', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
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

profileNav.post('/validate/password',(req, res)=>{
     console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    try{
        console.log(req.body);
        var replyBody = {};
        replyBody['match'] = tempDB.isMatch(req.body.username,req.body.password); //TEMPORARY WAY OF CHECKING, SHOULD BE THROUGH BCRYPT AND DB
        req.body = null;
        res.json(replyBody);
    }catch(e){
        console.log("Error on password validation");
        console.log(e);
    }
});

profileNav.post('/validate/username',(req, res)=>{
     console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    try{
        console.log(req.body);
        var replyBody = {};
        replyBody['match'] = tempDB.userExists(req.body.username); //TEMPORARY WAY OF CHECKING IT, SHOULD BE VIA DB
        req.body = null;
        res.json(replyBody);
    }catch(e){
        console.log("Error on username validation");
        console.log(e);
    }
});

export default profileNav;
console.log("Router: profile.js loaded!");