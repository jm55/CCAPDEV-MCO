import express from 'express';

const searchNav = express.Router();

//DB
import * as dispatch from '../middleware/dispatch.js';

//ENV
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import { redirectError } from '../middleware/errordispatch.js';
const load_limit = Number(process.env.LOAD_LIMIT);

//Utilities
import * as format from '../middleware/formatting.js'

/**
 * @todo
 */
searchNav.get('/search/:search.:category',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * 
     * VALIDATE IF LOGGEDIN
     * 
     */
    var userId = '9QoOG2nLvY';

    var search = "";
    var category = "";
    if(req.params['search'] != "\'\'")
        search = req.params['search'];
    if(req.params['category'] != "\'\'")
        category = req.params['category'];

    dispatch.getPosts(null, load_limit, search, category, userId).then((data)=>{
        if(data!=null){
            res.render("search", {
                title: "Home - Budol Finds",
                currentUser: data[0],
                pageid: data[2],
                //likes: tempDB.likes,
                search:search,
                category:category,
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
                    searchval(){
                        if(search != "")
                            return 'value=\''+search+'\'';
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
});

/**
 * @todo
 */
searchNav.put('/search/more',(req, res)=>{
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    /**
     * 
     * VALIDATE IF LOGGEDIN
     * 
     */
    var userId = '9QoOG2nLvY';
    dispatch.getPosts(req.body['pageid'], load_limit, req.body['search'], req.body['categories'], userId).then((data)=>{
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

export default searchNav;
console.log("Router: search.js loaded!");