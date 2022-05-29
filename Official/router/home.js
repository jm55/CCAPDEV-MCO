import express from 'express';

const homeNav = express.Router();

//TempDB
import * as tempDB from '../utils/tempDB.js';

//Home
homeNav.get('/home', (req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + "=>" + req.url);
    /**
     * 
     * CHECK IF USER IS LOGGED IN. IF SO, THEN RENDER THE PAGE BELOW, ELSE THEN REDIRECT BACK TO LOGIN.
     * 
     */
    res.render("home", {
        title: "Home - Budol Finds",
        currentUser: tempDB.currentUser,
        currentUserId   : tempDB.currentUser.userId,
        posts: tempDB.posts,
        helpers: {
            fullName(fname, mname, lname){return lname + ", " + fname + " " + mname.substring(0,1) + "."},
            simpleDateTime(dt){return dt.toLocaleDateString();},
            likes(like){
                if(like > 1)
                    return "Likes: " + like;
                else
                    return "Like: " + like;
            }
        }
    });
});

export default homeNav;
console.log("Router: home.js loaded!");