import express from 'express';

const logNav = express.Router();

//Login
logNav.get('/login', (req,res)=>{
    console.log(req.url);
    res.render("login", {title: "Login - Budol Finds"}); 
});

//Confirm Login
logNav.post('/login/in',(req, res)=>{
    console.log(req.url);
    try {
        
        /**
         * AUTHENTICATE HERE
         * 
         * USE BCRYPT
         * SEND 200 IF AUTHENTICATED
         * SEND 400 IF !AUTHENTICATED
         */
        
        res.sendStatus(200);
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

//Logout
logNav.get('/logout', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);
    res.render("logout",{title: "Logging out..."});
});

//Confirm Logout
logNav.post('/logout/out',(req, res)=>{
    console.log(req.url);
    try {
        /**
         * VERIFY LOGOUT HERE
         */
        console.log(req.body);
        res.sendStatus(200); //NOT SURE IF NEEDED
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(400);
    }
});


export default logNav;