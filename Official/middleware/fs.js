import fs from 'fs';

const POST_DIR = process.env.POSTIMG_DIR;
const DP_DIR = process.env.DPIMG_DIR;

/**
 * Deletes an image associated to a post as specified in postHash.
 * @param {String} postHash 
 */
export function deletePostImg(postHash){
    fs.unlinkSync(POST_DIR+postHash+".webp");
}

/**
 * Deletes an image associated to a user as specified in userId.
 * @param {String} userId 
 */
export function deleteDP(userId){
    fs.unlinkSync(DP_DIR+userId+".webp");
}

/**
 * Renames an image from its original name to the postHash.
 * Changes extension of file to .webp instead of various image file formats.
 * Utilized as compensation for lack of method to rename the file on the fly as multer writes it on the system.
 * @param {String} originalName 
 * @param {String} postHash 
 * @returns Success value of true or false.
 */
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

/**
 * Renames an image from its original name to the userId.
 * Changes extension of file to .webp instead of various image file formats.
 * Utilized as compensation for lack of method to rename the file on the fly as multer writes it on the system.
 * @param {String} originalName 
 * @param {String} userId 
 * @returns Success value of true or false.
 */
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