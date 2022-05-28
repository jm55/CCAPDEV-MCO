//Express
import express from 'express';

//Multer
import * as mult from '../middleware/mult.js';

//dotenv
import 'dotenv/config';

//Creating UserIds
import {newUserId} from "../middleware/hashIds.js";

//Passwords and sht
import bcrypt from 'bcrypt';
const salt = 10;

//File Renaming (cannot bypass Multer issue of not being able to name file prior to call.)
import fs from 'fs';

const signupNav = express.Router();

//Signup Page
signupNav.get('/signup', (req,res)=>{
    console.log(req.socket.remoteAddress + ": " + req.url);
    res.render("signup", {title: "Sign up - Budol Finds"}); 
});

import * as file from '../middleware/fs.js';

//Signup Save File
signupNav.post('/signup/save', mult.upload_dp.single('profilepic-select'), (req, res, next)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS;
    console.log(req.socket.remoteAddress + ": " + req.url);
    req.body['password_b'] = null;
    bcrypt.hash(req.body['password_a'], 10, function(err, hash) {
        if(err != null){
            res.sendStatus(500);
        }else{
            req.body["password_a"] = null;
            req.body["passhash"] = hash;
            req.body["userId"] = newUserId();
            req.body["profilepic"] = '/img/dp/' + req.body['userId'] + ".webp";
            try{
                console.log(req.body); //<= Save Contents to Database
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