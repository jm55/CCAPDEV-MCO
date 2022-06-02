import express from 'express';

const profileNav = express.Router();
profileNav.use(express.json());

//Utilities
import * as format from '../middleware/formatting.js';
import * as mult from '../middleware/mult.js';
import * as file from '../middleware/fs.js';
import * as dbUser from '../db/controller/userController.js';
import 'dotenv/config';
import bcrypt from 'bcrypt';

//DB
import * as dispatch from '../middleware/dispatch.js';

/**
 * @todo
 * User (other User Profile)
 */
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
    const currentUserId = '1'; //UPDATE USING SESSION userId VALUE
    const targetUserName = req.params['username'];
    
    dispatch.getUserPair(currentUserId, targetUserName).then((userPair)=>{
        if(userPair[1] != null){
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
        }else{
            res.render("err", {
                title: "Error - Budol Finds",
                errID: "404",
                errMsg: "Nothing to see here..."
            });
        }
    });
});

/**
 * @todo
 * User Post Search
 */
 profileNav.get('/user/:username/search', (req, res)=>{
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
    
    /**
     * 
     * 
     * CONDUCT COLLECTION OF POSTS AND RENDER AS PROFILE WITH POSTS FILTERED ACCORDINGLY.
     * 
     * 
     */
});

/**
 * @todo
 * Profile
 */
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

/**
 * @todo
 * Profile Search
 */
profileNav.get('/profile/search', (req, res)=>{
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
    
    /**
     * 
     * 
     * CONDUCT COLLECTION OF POSTS AND RENDER AS PROFILE WITH POSTS FILTERED ACCORDINGLY.
     * 
     * 
     */
});

/** Profile Settings */
profileNav.get('/profile/settings', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);

    var userId = '1'; //UPDATE USING SESSION userId VALUE

    dispatch.getCurrentUserByID(userId).then((user)=>{
        res.render("profile_settings", {
            title: "Profile Settings - Budol Finds",
            currentUser: user,
            currentUserJSON: JSON.stringify(user),
        });
    });
});

/** Save Profile */
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

/**
 * @todo
 * Delete Profile
 */
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

/** Validate Password */
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
        res.sendStatus(500);
    }
});

/** Validate Username */
profileNav.post('/validate/username',(req, res)=>{
     console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    try{
        var username = 'amelia.watson'; //req.body.username;
        dbUser.userExists(username).then((result)=>{ //
            var state = false;
            if(username == result.username)
                state = true;
            var replyBody = {};
            replyBody['match'] = state; 
            req.body = null;
            res.json(replyBody);
        });
    }catch(e){
        console.log("Error on username validation");
        console.log(e);
        res.sendStatus(500);
    }
});

export default profileNav;
console.log("Router: profile.js loaded!");