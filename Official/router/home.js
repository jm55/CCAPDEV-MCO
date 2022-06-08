import express from 'express';

const homeNav = express.Router();
homeNav.use(express.json());

//Utilities
import * as format from '../middleware/formatting.js'

//DB
import * as dispatch from '../middleware/dispatch.js';

//Error management
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

//ENV
import 'dotenv/config';
const load_limit = Number(process.env.LOAD_LIMIT);

//Cookies & Session
import * as cookie from '../middleware/cookie.js';
import session from 'express-session';

homeNav.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
        maxAge:1000*60*60*24*30,
        httpOnly: true
    }
}));

/** Home */
homeNav.get('/home', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null){
        res.redirect('/');
    }else{
        dispatch.getPosts(null, load_limit, "", "", userId).then((data)=>{
            if(data != null){
                res.render("home", {
                    title: "Home - Budol Finds",
                    currentUser: data[0],
                    pageid: data[2],
                    //likes: tempDB.likes,
                    search:"",
                    category:"",
                    posts: data[1], //POSTS
                    helpers: {
                        fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
                        simpleDateTime(dt){return format.simpleDateTime(dt);},
                        likes(like){return format.pluralInator('Like',like);},
                        btnLiked(postHash){
                            for(var p of data[1])
                                if(p.postHash == postHash)
                                    for(var u of p.likeVals)
                                        if(u.userId == data[0].userId)
                                            return "Liked";
                            return "Like";
                        },
                        editable(postUserId){
                            if(postUserId == data[0].userId)
                                return "block";
                            else
                                return "none";
                        },
                        convertEscapeChar(text){
                            return format.convertEscapeChar(text);
                        }
                    }
                });
            }else{
                redirectError(res, StatusCodes.FORBIDDEN);
            }
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
});

homeNav.put('/home/more',(req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    
    var userId = cookie.getCookieUserId(reqVal.session);
    if(userId == null)
        res.redirect('/');
    else{
        dispatch.getPosts(reqVal.body['pageid'], load_limit, reqVal.body['search'], req.body['categories'], userId).then((data)=>{
            var dataJSON = {};
            //dataJSON['user'] = data[0];
            dataJSON['posts'] = data[1];
            dataJSON['pageid'] = data[2];
            res.json(dataJSON);
        }).catch((error)=>{
            res.statusMessage = error;
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
});

export default homeNav;
console.log("Router: home.js loaded!");