import fs from 'fs';

const POST_DIR = process.env.POSTIMG_DIR;
const DP_DIR = process.env.DPIMG_DIR;

export function renamePostImg(originalName, postHash){
    var success = false;
    fs.rename(POST_DIR+originalName, POST_DIR+postHash+".webp", (e)=>{
        if(e == null)
            success = true;
        else
            console.error(e);
    });
    return success;
}

export function renameDP(originalName, userId){
    var success = false;
    fs.rename(DP_DIR+originalName, DP_DIR+userId+".webp", (e)=>{
        if(e == null)
            success = true;
        else
            console.error(e);
    });
    return success;
}

export default {};
console.log("Middleware: mult.js loaded!");