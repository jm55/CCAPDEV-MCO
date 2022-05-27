//Multer and file storage
//Reference: https://github.com/RugvedB/Nodejs-Multer-File
import multer from 'multer';

var posts_storage  = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/img/post_img');
    },
    filename: function(req, file, cb){
        cb(null, req.body.filename + ".webp");
    }
});

var dp_storage  = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/img/dp');
    },
    filename: function(req, file, cb){
        cb(null, req.body.filename + ".webp");
    }
});

export var upload_post = multer({ storage: posts_storage });
export var upload_dp = multer({ storage: dp_storage });

export default {};
console.log("Middleware: mult.js loaded!");