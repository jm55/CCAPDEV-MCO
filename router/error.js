import express from 'express';

//Error management
import { StatusCodes } from 'http-status-codes';
import {redirectError} from '../middleware/errordispatch.js';

const errorNav = express.Router();
errorNav.use(express.json());

errorNav.get('/error',(req,res)=>{
    redirectError(res, req.body['status']);
});

export default errorNav;