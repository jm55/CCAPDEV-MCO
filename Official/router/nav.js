import express from 'express';

const rootNav = express.Router();

//Index
rootNav.get('/', (req, res)=>{
    console.log(req.url);
    res.redirect('/login');
});

//Login
rootNav.get('/login', (req,res)=>{
    console.log(req.url);
    res.render("login", {title: "Login - Budol Finds"}); 
});

//Signup
rootNav.get('/signup', (req, res)=>{
    console.log(req.url);
    res.render("signup",  {title: "Signup - Budol Finds"});
});

rootNav.get('/logout', (req, res)=>{ //TO UPGRADE THAT ALLOWS /post/<posthash> TO ACCESS SPECIFIC POSTS
    console.log(req.url);

    //DO LOGOUT PROCEDURE HERE

    res.redirect('/');
});

export default rootNav;