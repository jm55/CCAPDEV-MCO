import express, { application } from 'express';

const debugTest = express.Router();
debugTest.use(express.json());

//Utilities
import * as format from '../middleware/formatting.js'

//DB via Dispatch
import * as dispatch from '../middleware/dispatch.js';

//Error management
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

/** Root Debug Access */
debugTest.all('/debug',(req,res)=>{
    redirectError(res, StatusCodes.FORBIDDEN);
});

/** Load more posts to home */
debugTest.put('/debug/home/more',(req, res)=>{
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

export default debugTest;
console.log("Router: debug.js loaded!");