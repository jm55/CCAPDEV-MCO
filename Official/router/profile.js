import express from 'express';

const profileNav = express.Router();

//Utilities
import * as tempDB from '../utils/tempDB.js';
import * as format from '../middleware/formatting.js';
import * as mult from '../middleware/mult.js';
import * as file from '../middleware/fs.js';
import * as dbUser from '../db/controller/userController.js';
import 'dotenv/config';
import bcrypt from 'bcrypt';

//DB
import * as dispatch from '../middleware/dispatch.js';

//TempUser
var targetUser = tempDB.users[1];

//User (other User Profile)
profileNav.get('/user/:username', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * 
     * EXTRACT USERNAME FROM URL
     * 
     * SEARCH DB FOR USERNAME
     * 
     * IF EXISTS, RENDER PAGE ELSE LET IT RENDER AS EMPTY
     * 
     */
    res.render("viewuser",  {
        title: format.buildTitle(targetUser.username),
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
    /**
     * 
     * CHECK WHO'S SESSION IS THIS AND IF LOGGED IN
     * 
     * IF LOGGED IN FIND USER IN DB
     * AND LIST POSTS WHERE AUTHOR IS DB
     * 
     *
     */  
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
        var body = req.body;
        var file = req.file;
        var currHash = "";
        dbUser.getHash(body['userId']).then((arr)=>{
            currHash = arr[0]['passhash'];
            bcrypt.compare(body['password_current'], currHash, (error, same)=>{
                if(error != null)
                    res.sendStatus(500);
                if(same){
                    if(String(body['password_a']).length > 0 && String(body['password_b']).length){
                        if(String(body['password_a'])==String(body['password_b'])){ //NEW PASSWORD
                            bcrypt.hash(req.body['password_b'], Number(process.env.SALT_ROUNDS),(err, enc)=>{
                                if(err != null)
                                    res.sendStatus(500);
                                else{
                                    body['password_current'] = null;
                                    body['password_a'] = null;
                                    body['password_b'] = null;
                                    body['passhash'] = enc;
                                    if(req.file)
                                        dpUpdate(file.originalname, body['userId']);
                                    dbUser.updateUser(body);
                                    res.sendStatus(200);
                                }
                            });
                        }else{
                            console.log("New Password Mismatch!");
                            res.sendStatus(400);
                        }
                    }else{ //NO NEW PASSWORD
                        if(file)
                            dpUpdate(file.originalname, body['userId']);
                        dbUser.updateUser(body);
                        res.sendStatus(200);
                    }
                }else{
                    console.log("Password not found on DB!");
                    res.sendStatus(403);
                }
            });
        });
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
        dbUser.getHashViaUsername(req.body['username']).then((user)=>{
            console.log(user);
            var hash = user[0]['passhash'];
            bcrypt.compare(req.body['password'],hash,(error, same)=>{
                if(error != null)
                    console.log(error);
                replyBody['match'] = same;
                req.body = null;
                res.json(replyBody);
            });
        }).catch((error)=>{
            console.log(error);
        });
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