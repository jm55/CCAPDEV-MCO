//Multer and file storage
//Reference: https://github.com/RugvedB/Nodejs-Multer-File
import multer from 'multer';

/**
 * Multer write parameters for post images.
 */
var posts_storage  = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, process.env.POSTIMG_DIR);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

/**
 * Multer write parameters for dp images.
 */
var dp_storage  = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, process.env.DPIMG_DIR);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

export var buffer = multer();

export var upload_post = multer({ storage: posts_storage });
export var upload_dp = multer({ storage: dp_storage });

export default {};
console.log("Middleware: mult.js loaded!");