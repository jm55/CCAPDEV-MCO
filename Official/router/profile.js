import express from 'express';

const profileNav = express.Router();
profileNav.use(express.json());

//Utilities
import * as format from '../middleware/formatting.js';
import * as mult from '../middleware/mult.js';
import * as file from '../middleware/fs.js';

//dotenv
import 'dotenv/config';
const quantity = Number(process.env.LOAD_LIMIT);

//Encryption
import bcrypt from 'bcrypt';

//DB
import * as dispatch from '../middleware/dispatch.js';
import * as dbUser from '../db/controller/userController.js';

//Error handling
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

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
            dispatch.getProfileById(null, quantity, "", targetUser.userId).then((data)=>{
                const posts = data[1];
                res.render("viewuser",  {
                    title: format.buildTitle(targetUser.username),
                    currentUser: currentUser,
                    targetUser: targetUser, //PERTAINS TO A TARGET USER'S ACCOUNT
                    posts: posts,
                    postCount: data[3],
                    reportCount: targetUser['reportCount'],
                    pageid: data[2],
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
            }).catch((err)=>{
                res.statusMessage = err;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            });
        }else{
            redirectError(res, StatusCodes.NOT_FOUND);
        }
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/**
 * @todo
 * User Post Search
 */
 profileNav.put('/user/:username/:search/more', (req, res)=>{
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

    const currentUserId = '1'; //UPDATE USING SESSION userId VALUE
    const targetUserName = req.params['username'];

    var search = "";
    if(req.params['search'] != "\'\'")
        search = req.params['search'];

    console.log(req.body);

    dispatch.getUserPair(currentUserId, targetUserName).then((userPair)=>{
        if(userPair[1] != null){
            const currentUser = userPair[0];
            const targetUser = userPair[1];
            dispatch.getProfileById(req.body['pageid'], quantity,search, targetUser.userId).then((data)=>{
                var dataJSON = {};
                dataJSON['posts'] = data[1];
                dataJSON['pageid'] = data[2];
                res.json(dataJSON);
            }).catch((err)=>{
                res.statusMessage = err;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            });
        }else{
            redirectError(res, StatusCodes.NOT_FOUND);
        }
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/**
 * @todo
 * User Post Search
 */
 profileNav.get('/user/:username/:search', (req, res)=>{
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

     const currentUserId = '1'; //UPDATE USING SESSION userId VALUE
     const targetUserName = req.params['username'];

    var search = "";
    if(req.params['search'] != "\'\'")
        search = req.params['search'];

     dispatch.getUserPair(currentUserId, targetUserName).then((userPair)=>{
        if(userPair[1] != null){
            const currentUser = userPair[0];
            const targetUser = userPair[1];
            dispatch.getProfileById(null, quantity, search, targetUser.userId).then((data)=>{
                const posts = data[1];
                res.render("viewuser",  {
                    title: format.buildTitle(targetUser.username),
                    currentUser: currentUser,
                    targetUser: targetUser, //PERTAINS TO A TARGET USER'S ACCOUNT
                    posts: posts,
                    postCount: data[3],
                    reportCount: targetUser['reportCount'],
                    usersearch: req.params['search'],
                    pageid: data[2],
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
            }).catch((err)=>{
                res.statusMessage = err;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            });
        }else{
            redirectError(res, StatusCodes.NOT_FOUND);
        }
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
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
     * IF NOT LOGGED IN ROUTE AS 401 OR RETURN TO INDEX
     *
     */  
    var userId = '1'; //UPDATE USING SESSION userId VALUE
    dispatch.getProfileById(null,quantity,"",userId).then((data)=>{
        var user = data[0]
        var posts = data[1];
        res.render("profile",  {
            title: format.buildTitle(user.username),
            currentUser: user, 
            targetUser: user,
            posts: posts,
            pageid: data[2],
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
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/**
 * @todo
 * Profile Search
 */
profileNav.get('/profile/search/:search', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    
    /**
     * 
     * CHECK WHO'S SESSION IS THIS AND IF LOGGED IN
     * 
     * IF LOGGED IN FIND USER IN DB
     * AND LIST POSTS WHERE AUTHOR IS DB
     * 
     * IF NOT LOGGED IN ROUTE AS 401 OR RETURN TO INDEX
     *
     */ 
    var userId = '1'; //UPDATE USING SESSION userId VALUE

    dispatch.getProfileById(null,quantity,req.params['search'],userId).then((data)=>{
        var user = data[0]
        var posts = data[1];
        res.render("profile",  {
            title: format.buildTitle(user.username),
            currentUser: user, 
            targetUser: user,
            posts: posts,
            pageid: data[2],
            profilesearch: req.params['search'], 
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
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/**
 * @todo
 * Profile Search
 */
 profileNav.put('/profile/search/more', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * 
     * CHECK WHO'S SESSION IS THIS AND IF LOGGED IN
     * 
     * IF LOGGED IN FIND USER IN DB
     * AND LIST POSTS WHERE AUTHOR IS DB
     * 
     * IF NOT LOGGED IN ROUTE AS 401 OR RETURN TO INDEX
     *
     */ 
    var userId = '1'; //UPDATE USING SESSION userId VALUE
    dispatch.getProfileById(req.body['pageid'],quantity,req.body['search'],userId).then((data)=>{
        var dataJSON = {};
        dataJSON['posts'] = data[1];
        dataJSON['pageid'] = data[2];
        res.json(dataJSON);
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/** Profile Settings */
profileNav.get('/profile/settings', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);

    /**
     * 
     * CHECK WHO'S SESSION IS THIS AND IF LOGGED IN
     * 
     * IF NOT LOGGED IN ROUTE AS 401 OR RETURN TO INDEX
     */  

    var userId = '3'; //UPDATE USING SESSION userId VALUE

    dispatch.getUserByID(userId).then((user)=>{
        res.render("profile_settings", {
            title: "Profile Settings - Budol Finds",
            currentUser: user,
            currentUserJSON: JSON.stringify(user),
        });
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/** Save Profile */
profileNav.patch('/profile/settings/save', mult.upload_dp.single('profilepic-select'), (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * 
     * CHECK WHO'S SESSION IS THIS AND IF LOGGED IN
     * 
     * IF NOT LOGGED IN ROUTE AS 401 OR RETURN TO INDEX
     */  
    var body = req.body;
    var file = req.file;
    var currHash = "";
    dbUser.getHash(body['userId']).then((arr)=>{
        currHash = arr[0]['passhash'];
        bcrypt.compare(body['password_current'], currHash, (error, same)=>{
            if(error != null)
                res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            if(same){
                if(String(body['password_a']).length > 0 && String(body['password_b']).length){
                    if(String(body['password_a'])==String(body['password_b'])){ //NEW PASSWORD
                        bcrypt.hash(req.body['password_b'], Number(process.env.SALT_ROUNDS),(err, enc)=>{
                            if(err != null)
                                res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
                            else{
                                body['password_current'] = null;
                                body['password_a'] = null;
                                body['password_b'] = null;
                                body['passhash'] = enc;
                                if(req.file)
                                    dpUpdate(file.originalname, body['userId']);
                                dbUser.updateUser(body);
                                res.sendStatus(StatusCodes.OK);
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
                    res.sendStatus(StatusCodes.OK);
                }
            }else{
                console.log("Password not found on DB!");
                res.sendStatus(StatusCodes.UNAUTHORIZED);
            }
        });
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/**
 * Updates the DP image on the directory by replacing the
 * original filename to the userId and returns the 
 * resulting dp image file path.
 * @param {String} originalname Original filename of the picture
 * @param {String} userid New filename of the picture (associated with the user)
 * @returns Path of the renamed file for use in the user object.
 */
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
    dispatch.deleteAccount(body['userId']).then((data)=>{
        return JSON.stringify(data);
    }).then((data)=>{
        for(var d of JSON.parse(data))
            file.deletePostImg(d.postHash);
        res.sendStatus(StatusCodes.OK);
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/** Validate Password */
profileNav.post('/validate/password',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    
    var replyBody = {};
    dbUser.getHashViaUsername(req.body['username']).then((user)=>{
        //console.log(user);
        var hash = user[0]['passhash'];
        bcrypt.compare(req.body['password'],hash,(error, same)=>{
            if(error != null)
                console.log(error);
            replyBody['match'] = same;
            req.body = null;
            res.json(replyBody);
        });
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/** Validate Username */
profileNav.post('/validate/username',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    dbUser.userExists(req.body['username']).then((result)=>{ //
        var state = false;
        if(req.body['username'] == result.username)
            state = true;
        var replyBody = {};
        replyBody['match'] = state; 
        req.body = null;
        res.json(replyBody);
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

export default profileNav;
console.log("Router: profile.js loaded!");