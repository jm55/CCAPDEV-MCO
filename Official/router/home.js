import express from 'express';

const homeNav = express.Router();
homeNav.use(express.json());

//Utilities
import * as format from '../middleware/formatting.js'

//DB
import * as dispatch from '../middleware/dispatch.js';

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
    /**
     * 
     * GET SEARCH PARAMETERS FROM BODY
     * 
     */
    const out = "Home Search Filter: "+req.params['searchVal'];
    console.log(out);
    res.send(out);
});

export default homeNav;
console.log("Router: home.js loaded!");