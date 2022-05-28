import fs from 'fs';

const POST_DIR = process.env.POSTIMG_DIR;
const DP_DIR = process.env.DPIMG_DIR;

export function renamePostImg(originalName, postHash){
    fs.rename(POST_DIR+originalName, POST_DIR+postHash+".webp", (e)=>{
        if(e!=null)
            console.log("NewPost Image error: " + e.message);
        else
            console.log("NewPost Image writing successful!");
    });
}

export function renameDP(originalName, userId){
    fs.rename(DP_DIR+originalName, DP_DIR+userId+".webp", (e)=>{
        if(e!=null)
            console.log("NewDP Image error: " + e.message);
        else
            console.log("NewDP Image writing successful!");
    });
}

export default {};
console.log("Middleware: mult.js loaded!");