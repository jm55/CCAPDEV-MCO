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
import * as db from '../db/controller/userController.js';

//Error management
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

const signupNav = express.Router();
signupNav.use(express.json());

/** Signup Page */
signupNav.get('/signup', (req,res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    res.render("signup", {title: "Sign up - Budol Finds"}); 
});

/** Signup Save */
signupNav.post('/signup/save', mult.upload_dp.single('profilepic-select'), (req, res, next)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS;
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    db.userExists(req.body['username'],{projection: {'username': 1, 'passhash': 1}}).then((f)=>{
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
                        db.addUser(req.body).then(()=>{
                            //Renames DP image
                            file.renameDP(req.file.originalname,req.body["userId"]);
                            res.sendStatus(StatusCodes.OK);
                        });
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