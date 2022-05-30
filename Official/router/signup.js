//Express
import express from 'express';

//Multer & File
import * as mult from '../middleware/mult.js';
import * as file from '../middleware/fs.js';

//dotenv
import 'dotenv/config';

//Creating UserIds
import {newUserId} from "../middleware/hashIds.js";

//Passwords and sht
import bcrypt from 'bcrypt';

const signupNav = express.Router();

//Signup Page
signupNav.get('/signup', (req,res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    res.render("signup", {title: "Sign up - Budol Finds"}); 
});



//Signup Save File
signupNav.post('/signup/save', mult.upload_dp.single('profilepic-select'), (req, res, next)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS;
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    req.body['password_b'] = null;
    bcrypt.hash(req.body['password_a'], process.env.SALT_ROUNDS, function(err, hash) {
        if(err != null){
            res.sendStatus(500);
        }else{
            req.body["password_a"] = null;
            req.body["passhash"] = hash;
            req.body["userId"] = newUserId();
            req.body["profilepic"] = process.env.DP_PUBLIC + req.body['userId'] + ".webp";
            try{
                console.log(req.body); //<= FILTER AND SAVE CONTENTS TO DATABASE
                //Renames DP image
                file.renameDP(req.file.originalname,req.body["userId"]);
                res.sendStatus(200);
            }catch(e){
                res.statusMessage = e;
                res.sendStatus(400);
            }
        }
    });
});


export default signupNav;
console.log("Router: signup.js loaded!");