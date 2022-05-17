const path = require('path');
const express = require('express');
const hbs = require('express-handlebars');

const PORT = process.env.PORT || 3000;

const app = express();

//setting static
app.use(express.static(__dirname + "/public"));

//view engine via handelbars
app.engine("hbs", hbs.engine({extname: 'hbs'}));
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("view cache", false);

app.get('/', (req, res)=>{
    //res.status(200).send("Hello World"); //SEND
    //res.status(200).json({"message":"Hello World"}); //SEND JSON FORMAT 
    //res.status(200).download("app.js"); //DOWNLOAD FILE
    res.redirect('/login');
});

app.get('/login', (req,res)=>{
    res.render("login", {title: "Login - Budol Finds"}); 
});

app.get('/home', (req, res)=>{
    res.render("home",  {title: "Home - Budol Finds"});
});

app.get('/signup', (req, res)=>{
    res.render("signup",  {title: "Signup - Budol Finds"});
});

app.get('/profile', (req, res)=>{
    res.render("profile",  {title: "{{user}} - Budol Finds"});
});

app.get('/profile_settings', (req, res)=>{
    res.render("profile_settings",  {title: "{{user}} - Budol Finds"});
});

app.listen(PORT, ()=>{
    console.log("This is app.js\nListening @ " + PORT);
});
