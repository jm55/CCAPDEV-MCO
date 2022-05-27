import express from 'express';
import * as mult from '../middleware/mult.js';

const signupNav = express.Router();

//Signup Page
signupNav.get('/signup', (req,res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    res.render("signup", {title: "Login - Budol Finds"}); 
});

//Signup Save
signupNav.post('/signup/save', mult.upload_dp.single('profilepic-select'), (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.socket.remoteAddress + ": " + req.url);
    try{    
        console.log(req.body);
        console.log(req.file);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

export default signupNav;
console.log("Router: signup.js loaded!");