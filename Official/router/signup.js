import express from 'express';

const signupNav = express.Router();

//Signup Page
signupNav.get('/signup', (req,res)=>{
    console.log(req.url);
    res.render("signup", {title: "Login - Budol Finds"}); 
});

//Signup Save
signupNav.post('/signup/save', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    try{
        console.log(req.body);
        res.sendStatus(200);
    }catch(e){
        res.statusMessage = e;
        res.sendStatus(400);
    }
    res.redirect('/');
});

export default signupNav;
console.log("Router: signup.js loaded!");