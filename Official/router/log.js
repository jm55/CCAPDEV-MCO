import express from 'express';

const logNav = express.Router();


//import * as hs from '../middleware/bcrypt.js'; //TEMPORARY ONLY
import bcrypt from 'bcrypt';
import * as db from '../db/controller/userController.js';

import tempDB from '../utils/tempDB.js';

//Login
logNav.get('/login', (req,res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    res.render("login", {title: "Login - Budol Finds"}); 
});

//Confirm Login
logNav.post('/login/in',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    var body = req.body;
    req.body = null;
    try {
        //console.log('Login Credentials: ' + JSON.stringify(body));
        db.userExists(body['username']).then((u)=>{
            if(u.username == body['username']){
                bcrypt.compare(String(body['password']),u.passhash,(err,same)=>{
                    if(err != null)
                        res.sendStatus(500);
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
        })
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Logout
logNav.get('/logout', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    res.render("logout",{title: "Logging out..."});
});

//Confirm Logout
logNav.post('/logout/out',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    try {
        /**
         * 
         * VERIFY LOGOUT HERE
         * 
         */
        console.log(req.body);
        res.sendStatus(200); //NOT SURE IF NEEDED
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(400);
    }
});


export default logNav;
console.log("Router: log.js loaded!");