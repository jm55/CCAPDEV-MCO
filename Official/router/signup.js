//Express
import express from 'express';

//Multer
import * as mult from '../middleware/mult.js';

//dotenv
import 'dotenv/config';

//Creating UserIds
import {newUserId} from "../utils/hashIds.js";

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

//Signup Save File
signupNav.post('/signup/save', mult.upload_dp.single('profilepic-select'), (req, res, next)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS;
    console.log(req.socket.remoteAddress + ": " + req.url);
    bcrypt.hash(req.body['password_a'], 10, function(err, hash) {
        req.body["passhash"] = hash;
        req.body["password_a"] = req.body["password_b"] = null;
        req.body["userId"] = newUserId();
        try{
            console.log(req.body); //<= Save Contents to Database

            //Renames DP image
            fs.rename('./public/img/dp/'+(req.file.originalname), './public/img/dp/ '+req.body["userId"]+".webp", (e)=>{
                if(e!=null)
                    console.log("NewDP Image error: " + e.message);
                else
                    console.log("NewDP Image writing successful!");
            });

            res.sendStatus(200);
        }catch(e){
            res.statusMessage = e;
            res.sendStatus(400);
        }
    });
});


export default signupNav;
console.log("Router: signup.js loaded!");