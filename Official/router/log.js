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

/** Login */
logNav.get('/login', (req,res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    res.render("login", {title: "Login - Budol Finds"}); 
});

/** Confirm Login */
logNav.post('/login/in',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    var body = req.body;
    db.userExists(body['username']).then((u)=>{
        if(u!=null){
            if(u['username'] == body['username']){
                bcrypt.compare(String(body['password']),u.passhash,(err,same)=>{
                    if(err != null)
                        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
                    /***
                     * 
                     * 
                     * 
                     * SET SESSION HERE OR SOMETHING.
                     * AWAIT FOR LESSONS IN AUTHENTICATION
                     * AS IT MAY OFFER KNOWLEDGE ON HOW TO DO SO.
                     * 
                     * 
                     */
                    res.json({success:same});
                });
            }else
                res.json({success:false}); 
        }else
            res.json({success:false});
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

/** Logout */
logNav.get('/logout', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    res.render("logout",{title: "Logging out..."});
});

/**
 * @todo
 * Confirm Logout
 */
logNav.post('/logout/out',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    try {
        /***
         * 
         * 
         * 
         * TERMINATE SESSION HERE
         * WAIT FOR LECTURE ABOUT AUTHENTICATION AND SESSION
         * 
         * 
         * 
         */
        console.log(req.body);
        res.sendStatus(StatusCodes.ACCEPTED); //NOT SURE IF NEEDED
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});


export default logNav;
console.log("Router: log.js loaded!");