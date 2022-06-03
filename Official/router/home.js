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

/** 
 * @todo
 * Home 
 */
homeNav.get('/home', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    
    /**
     * 
     * CHECK WHO'S LOGGED IN AND SET USERID
     * IF !LOGGED IN SET USERID
     *  
     */

    var userId = '1'; //UPDATE USING SESSION userId VALUE
    
    dispatch.getPosts(null, userId).then((data)=>{
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
                    }
                }
            });
        }else{
            redirectError(res, StatusCodes.FORBIDDEN);
        }
    });
});

/**
 * @todo
 * Home Search 
 */
homeNav.get('/home/search', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    const out = "Home Search Filter: "+req.params['searchVal'];
    /**
     * 
     * GET SEARCH PARAMETERS FROM BODY
     * RENDER PAGE HERE WITH THE SPECIFIED SEARCH PARAMETERS
     * 
     * USE HOME BUT WITH THE SEARCH AND CATEGORY PARAMETERS FROM REQ.BODY
     * 
     */
    res.send(out);
});

homeNav.put('/home/more',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * 
     * VALIDATE IF LOGGEDIN
     * 
     */
    var userId = '1';
    dispatch.getPosts(req.body['pageid'], userId).then((data)=>{
        var dataJSON = {};
        //dataJSON['user'] = data[0];
        dataJSON['posts'] = data[1];
        dataJSON['pageid'] = data[2];
        res.json(dataJSON);
    }).catch((error)=>{
        res.statusMessage = error;
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});

export default homeNav;
console.log("Router: home.js loaded!");