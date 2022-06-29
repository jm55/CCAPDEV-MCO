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

export default debugTest;
console.log("Router: debug.js loaded!");