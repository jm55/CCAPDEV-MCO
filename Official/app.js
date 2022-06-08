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

//Cookie-Parser & Session 
import cookieParser from 'cookie-parser';
import session from 'express-session';

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
if(Number(process.env.PRODUCTION) == 0)
    app.use(nocache());

//Enable JSON reading capability
app.use(express.json());

//Enable cookieParser
app.use(cookieParser());

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
import errorNav from './router/error.js';

//Use Routers
app.use(homeNav);
app.use(postNav);
app.use(logNav);
app.use(signupNav);
app.use(profileNav);
app.use(debugTest);
app.use(searchNav);

//Cookie management
import * as cookie from './middleware/cookie.js';

//HashId
import * as hashId from './middleware/hashIds.js';

app.use(session({
    secret: String(process.env.SECRET),
    resave: false, 
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    }
}));

//Index Route
app.get('/', (req, res)=>{
    var reqVal = req;
	console.log("Request: " + reqVal.socket.remoteAddress + ":" + reqVal.socket.remotePort + " => " + reqVal.url);
    if(cookie.getCookieUserId(reqVal.session) !== null){
        res.redirect('/home');
    }else{
        res.redirect('/login');
    }
});

//404 Route
app.use((req, res, err) => {
    console.log("404: " + req.socket.remoteAddress + "=>" + req.url);
    res.render("err", {
        title: "Not Found - Budol Finds",
        errID: StatusCodes.NOT_FOUND,
        errMsg: getReasonPhrase(StatusCodes.NOT_FOUND),
    });
});

//DB Connection
import * as db from './db/conn.js';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

db.connectMongoose();

db.connectToServer((err, callback)=>{
    if(err){
        console.error("db.connectToServer: Error occured connecting to server!");
        console.error("db.connectToServer: Please check if you have installed MongoDB or have internet connection.");
        console.error("db.connectToServer: " + err);
        process.exit(0);
    }
    
    db.checkDB().then((stats)=>{
        if(Number(stats.collections) == Number(process.env.COLLECTION_COUNT)){
            app.listen(PORT, ()=>{
                console.log("Budol Finds Server Listening @ " + PORT);
            });
        }else{
            console.error('Database server is online but the database does not exist nor configured correctly.');
            process.exit(0);
        }
    
    }).catch((error)=>{
        console.error("Error confirming database configuration.");
        console.error(error);
        process.exit(0);
    });
});