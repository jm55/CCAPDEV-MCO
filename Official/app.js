//Path __dirname fix: https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Express
import express from 'express';
import hbs from 'express-handlebars';

//dotenv
import 'dotenv/config';

//Favicon
import favicon from 'serve-favicon';

//nocache
import nocache from  'nocache';

//localhost:8080 or localhost:3000
const PORT = process.env.PORT || 3000;

//Express instance
const app = express();

//Setting static/public directory
app.use(express.static(__dirname + "/public"));

//View Engine via Express-Handlebars
app.engine("hbs", hbs.engine({extname: 'hbs'}));
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("view cache", false);

//Further disable caching
if(Number(process.env.PRODUCTION) == 0){
    app.use(nocache());
}

//Enable JSON reading capability
app.use(express.json());

//Add favicon
app.use(favicon(__dirname + '/public/img/favicons/favicon.ico'));

//Routers
import postNav from './router/posts.js';
import logNav from './router/log.js';
import signupNav from './router/signup.js';
import homeNav from './router/home.js';
import profileNav from './router/profile.js';
import debugTest from './router/debug.js';
import searchNav from './router/search.js';

//Use Routers
app.use(homeNav);
app.use(postNav);
app.use(logNav);
app.use(signupNav);
app.use(profileNav);
app.use(debugTest);
app.use(searchNav);

//Index Route
app.get('/', (req, res)=>{
    /**
     * 
     *  ROUTE TO HOME PAGE IF LOGGED IN (I.E. HAS SESSION), ELSE THEN ROUTE TO LOGIN PAGE
     * 
     */
    console.log("Request: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " => " + req.url);
    res.redirect('/login');
});

//404 Route
app.use((req, res, err) => {
    console.log("404: " + req.socket.remoteAddress + "=>" + req.url);
    res.render("err", {
        title: "Error - Budol Finds",
        errID: "404",
        errMsg: "Nothing to see here..."
    });
});

//DB Connection
import * as db from './db/conn.js';

db.connectToServer((err, callback)=>{
    if(err){
        console.error("db.connectToServer: Error occured connecting to server!");
        console.error("db.connectToServer: Please check if you have installed MongoDB or have internet connection.");
        console.error("db.connectToServer: " + err);
        process.exit;
    }

    //DB is accessible
    db.checkDB();
    app.listen(PORT, ()=>{
        console.log("Budol Finds Server Listening @ " + PORT);
    });
});