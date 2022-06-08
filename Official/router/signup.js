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

//DB
import * as db from '../db/conn.js'; //MongoDB
import * as userController from '../db/controller/userController.js'; //User Controller
import * as dispatch from '../middleware/dispatch.js'; //DB Dispatch
import {User} from '../model/users.js'; //User Model

//Error management
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

const signupNav = express.Router();
signupNav.use(express.json());

//Cookies & Session
import * as cookie from '../middleware/cookie.js';
import session from 'express-session';

signupNav.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge:1000*60*60*24*30,
            httpOnly: true
        }
}));

/** Signup Page */
signupNav.get('/signup', (req,res)=>{
    var reqVal = req;
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId != null)
        res.redirect('/');
    else{
        console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
        res.render("signup", {title: "Sign up - Budol Finds"}); 
    }
});

/** Signup Save */
signupNav.post('/signup/save', mult.upload_dp.single('profilepic-select'), (req, res, next)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS;
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    dispatch.getUserByUserName(req.body['username'],{projection: {'username': 1, 'passhash': 1}}).then((f)=>{
        var exists = false;
        if(f)
            if(f.username == req.body['username'])
                exists = true;
        if(exists){
            res.sendStatus(StatusCodes.FORBIDDEN);
        }else{
            req.body['password_b'] = null;
            bcrypt.hash(req.body['password_a'], Number(process.env.SALT_ROUNDS), function(err, hash) {
                if(err != null){
                    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
                }else{
                    req.body["password_a"] = null;
                    req.body["passhash"] = hash;
                    req.body["userId"] = newUserId();
                    req.body["profilepic"] = process.env.DP_PUBLIC + req.body['userId'] + ".webp";
                    try{
                        User.create(req.body,(err)=>{
                            if(err){
                                console.error('Error occured on creating object via Users model.');
                                console.error(err);
                                res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
                            }else{
                                console.log('User created');
                                file.renameDP(req.file.originalname,req.body["userId"]);
                                res.sendStatus(StatusCodes.OK);
                            }
                        });
                        // userController.addUser(req.body).then(()=>{
                        //     //Renames DP image
                        //     file.renameDP(req.file.originalname,req.body["userId"]);
                        //     res.sendStatus(StatusCodes.OK);
                        // });
                    }catch(e){
                        res.statusMessage = e;
                        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
                    }
                }
            });
        }
    }).catch((e)=>{
        res.statusMessage = e;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});


export default signupNav;
console.log("Router: signup.js loaded!");