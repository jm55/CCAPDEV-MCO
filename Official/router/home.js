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

/** Home */
homeNav.get('/home', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    
    var userId = '1'; //UPDATE USING SESSION userId VALUE
    
    dispatch.getCurrentUserByID(userId).then((userdata)=>{
        var user = userdata;
        dispatch.getHomePost().then((posts)=>{
            res.render("home", {
                title: "Home - Budol Finds",
                currentUser: user,
                //likes: tempDB.likes,
                search:"",
                category:"",
                posts: posts, //POSTS
                helpers: {
                    fullName(fname, mname, lname){return format.formalName(fname,mname,lname);},
                    simpleDateTime(dt){return format.simpleDateTime(dt);},
                    likes(like){return format.pluralInator('Like',like);},
                    btnLiked(postHash){
                        for(var p of posts)
                            if(p.postHash == postHash)
                                for(var u of p.likeVals)
                                    if(u.userId == user.userId)
                                        return "Liked";
                        return "Like";
                    },
                    editable(postUserId){
                        if(postUserId == user.userId)
                            return "block";
                        else
                            return "none";
                    }
                }
            });
        });
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

export default homeNav;
console.log("Router: home.js loaded!");