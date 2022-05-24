//Path __dirname fix: https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import hbs from 'express-handlebars';

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
    console.log('index redirecting...');
    res.redirect('/login');
});

import utils from './utils.js';

app.get('/login', (req,res)=>{
    res.render("login", {title: "Login - Budol Finds"}); 
});

app.get('/home', (req, res)=>{
    utils.autoFill();
    console.log(utils.users);
    console.log(utils.posts);
    console.log(utils.comments);
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
