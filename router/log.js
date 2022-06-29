import express from 'express';

const logNav = express.Router();
logNav.use(express.json());

//Encryption
import bcrypt from 'bcrypt';

//DB
import * as db from '../db/controller/userController.js';

//Error handling
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

//Cookies & Session
import * as cookie from '../middleware/cookie.js';
import session from 'express-session';

logNav.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge:1000*60*60*24*30,
            httpOnly: true
        }
}));

/** Login */
logNav.get('/login', (req,res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);  
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId != null)
        res.redirect('/home');
    else
        res.render("login", {title: "Login - Budol Finds"}); 
});

/** Confirm Login */
logNav.post('/login/in',(req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId != null)
        res.redirect('/home');
    else{
        var body = req.body;
        db.userExists(body['username'],{projection: {'username': 1, 'passhash': 1, 'userId':1}}).then((u)=>{
            if(u!=null){
                if(u['username'] == body['username']){
                    bcrypt.compare(String(body['password']),u.passhash,(err,same)=>{
                        if(err != null){
                            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
                        }
                        if(same){
                            req.session.userId = String(u.userId);
                            //res.cookie('budolfinds',u.userId,{maxAge:30*24*60*60*1000,httpOnly:true}); //30days max
                            res.json({success:same});
                        }else{
                            res.json({success:false});
                        }
                    });
                }else
                    res.json({success:false}); 
            }else
                res.json({success:false});
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
    
});

/** Logout */
logNav.get('/logout', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    res.render("logout",{title: "Logging out..."});
});

logNav.post('/logout/out',(req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    try {
        var userId = cookie.getCookieUserId(reqVal.session);
        if(userId == null)
            res.redirect('/');
        else{
            req.session.destroy((error)=>{
                if(error){
                    res.statusMessage = error;
                    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
                }else
                    res.sendStatus(StatusCodes.ACCEPTED);
            });
            //res.clearCookie("budolfinds");
        }
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});


export default logNav;
console.log("Router: log.js loaded!");