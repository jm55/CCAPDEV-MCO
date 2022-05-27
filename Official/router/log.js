import express from 'express';

const logNav = express.Router();

import * as hs from '../utils/bcrypt.js';

//Login
logNav.get('/login', (req,res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    res.render("login", {title: "Login - Budol Finds"}); 
});

//Confirm Login
logNav.post('/login/in',(req, res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    var body = req.body;
    req.body = null;
    body["password"] = hs.getHash(body["password"]); //in hash already
    try {
        console.log("Login Credentials: " + JSON.stringify(body));
        /**
         * AUTHENTICATE HERE
         * 
         * USE BCRYPT
         * SEND 200 IF AUTHENTICATED
         * SEND 500 IF !AUTHENTICATED
         * 
         * REGARDLESS, LOGIN MUST BE MADE
         */
        res.sendStatus(200);
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Logout
logNav.get('/logout', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.socket.remoteAddress + ": " + req.url);
    res.render("logout",{title: "Logging out..."});
});

//Confirm Logout
logNav.post('/logout/out',(req, res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    try {
        /**
         * VERIFY LOGOUT HERE
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