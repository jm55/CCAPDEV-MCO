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

//Cookies
import * as cookie from '../middleware/cookie.js';
import session from 'express-session';

profileNav.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge:1000*60*60*24*30,
            httpOnly: true
        }
}));

/** User (other User Profile) */
profileNav.get('/user/:username', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var currentUserId = cookie.getCookieUserId(reqVal.session);
    if(currentUserId == null)
        res.redirect('/');
    else{   
        var targetUserName = req.params['username'];
        dispatch.getUserPair(currentUserId, targetUserName).then((userPair)=>{
            if(userPair[1] != null){
                dispatch.getProfileById(null, quantity, "", userPair[1].userId).then((data)=>{
                    renderProfile(res, 'viewuser', userPair[0], userPair[1], data, '');
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
    }    
});

/** User Post Search */
 profileNav.get('/user/:username/:search', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);

    var currentUserId = cookie.getCookieUserId(reqVal.session);
    if(currentUserId == null)
        res.redirect('/');
    else{  
        const targetUserName = req.params['username'];

        var search = "";
        if(req.params['search'] != "\'\'")
            search = req.params['search'];

        dispatch.getUserPair(currentUserId, targetUserName).then((userPair)=>{
            if(userPair[1] != null){
                dispatch.getProfileById(null, quantity, search, userPair[1].userId).then((data)=>{
                    renderProfile(res,'viewuser',userPair[0],userPair[1],data,req.params['search']);
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
    } 
});

/** User Post Search */
 profileNav.put('/user/:username/:search/more', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);

    var currentUserId = cookie.getCookieUserId(reqVal.session);
    if(currentUserId == null)
        res.redirect('/');
    else{
        var targetUserName = req.params['username'];

        var search = "";
        if(req.params['search'] != "\'\'")
            search = req.params['search'];
    
        dispatch.getUserPair(currentUserId, targetUserName).then((userPair)=>{
            if(userPair[1] != null){
                dispatch.getProfileById(req.body['pageid'], quantity,search, userPair[1].userId).then((data)=>{
                    res.json(buildLoadMoreJSON(data));
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
    }
});

/** Profile */
profileNav.get('/profile', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);

    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dispatch.getProfileById(null,quantity,"",userId).then((data)=>{
            renderProfile(res, 'profile', data[0],data[0], data, '');
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
    
});

/** Profile Search */
profileNav.get('/profile/search/:search', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dispatch.getProfileById(null,quantity,req.params['search'],userId).then((data)=>{
            renderProfile(res, 'profile', data[0], data[0], data, req.params['search']);
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
});

/** Profile Search */
 profileNav.put('/profile/search/more', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dispatch.getProfileById(req.body['pageid'],quantity,req.body['search'],userId).then((data)=>{
            res.json(buildLoadMoreJSON(data));
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
});

/** Profile Settings */
profileNav.get('/profile/settings', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);

    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
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
    }
});

/** Save Profile */
profileNav.patch('/profile/settings/save', mult.upload_dp.single('profilepic-select'), (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        var body = req.body;
        var file = req.file;
        dbUser.getHash(body['userId']).then((arr)=>{
            bcrypt.compare(body['password_current'], arr[0]['passhash'], (error, same)=>{
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
    }
    
});

/** Delete Profile */
profileNav.delete('/profile/settings/delete', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    var body = reqVal.body;
    req.body = null;
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dispatch.deleteAccount(body['userId']).then((data)=>{
            return data;
        }).then((data)=>{
            file.deleteDP(data[0]);
            for(var d of data[1])
                file.deletePostImg(d.postHash);
            
            res.clearCookie("budolfinds");
            res.sendStatus(StatusCodes.OK);
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
    
});

/** Validate Password */
profileNav.post('/validate/password',(req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        var replyBody = {};
        dbUser.getHashViaUsername(req.body['username']).then((user)=>{
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
    }
});

/** Validate Username */
profileNav.post('/validate/username',(req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dbUser.userExists(req.body['username'],{projection: {'username': 1, 'passhash': 1}}).then((result)=>{ //
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
    } 
});

/**
 * Builds a JSON object for loading more posts containing posts and pageid.
 * @param {Object} data Data that will be converted into JSON. Must be from dispatch.getProfileById();
 * @returns JSON object that contains the posts and next pageid.
 */
function buildLoadMoreJSON(data){
    var json = {};
    json['posts'] = data[1],
    json['pageid'] = data[2];
    return json;
}

/**
 * Renders the profile page of a given target user (both for search and non-search).
 * @param {import('express').Response} res Express Response object 
 * @param {String} view Target view page
 * @param {Object} currentUser Logged in user
 * @param {Object} targetUser User being viewed
 * @param {Object} data List of data that will be used to render the page. Contains the following [userVal,posts,newPage,postCount]
 * @param {String} search Keyword that was used for search.
 */
function renderProfile(res, view, currentUser, targetUser, data, search){
    res.render(view, {
        title: format.buildTitle(targetUser.username),
        currentUser: currentUser,
        targetUser: targetUser, //PERTAINS TO A TARGET USER'S ACCOUNT
        posts: data[1],
        postCount: data[3],
        reportCount: targetUser['reportCount'],
        profilesearch: search,
        usersearch: search,
        pageid: data[2],
        helpers: {
            fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
            simpleDateTime(dt){return format.simpleDateTime(dt);},
            likes(like){return format.pluralInator('Like',like);},
            btnLiked(postHash){
                for(var p of data[1])
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
            },
            convertEscapeChar(text){
                return format.convertEscapeChar(text);
            }
        }
    });
}

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


export default profileNav;
console.log("Router: profile.js loaded!");