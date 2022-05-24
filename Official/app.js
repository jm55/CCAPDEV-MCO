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

// Enable JSON reading capability
app.use(express.json());

app.get('/', (req, res)=>{
    //res.status(200).send("Hello World"); //SEND
    //res.status(200).json({"message":"Hello World"}); //SEND JSON FORMAT 
    //res.status(200).download("app.js"); //DOWNLOAD FILE
    console.log(req.url);
    res.redirect('/login');
});

//FakeDB
import utils from './utils/utils.js';
utils.autoFill();
utils.appendPostMetadata();
var users = utils.getUsers();
var posts = utils.getPosts();
var comments = utils.getComments();
var currentUser = users[0];

//Controllers


app.get('/login', (req,res)=>{
    console.log(req.url);
    res.render("login", {title: "Login - Budol Finds"}); 
});

app.get('/home', (req, res)=>{
    console.log(req.url);
    res.render("home", {
        title: "Home - Budol Finds",
        currentUser: currentUser,
        posts: posts,
        helpers: {
            fullName(fname, mname, lname){return lname + ", " + fname + " " + mname.substring(0,1) + "."},
            likeBtn(id, posthash){return "submitLike(" + id + "," + posthash + ")";},
        }
    });
});

app.post("/home/post", (req, res) => {
    console.log("new post received: ");
    try {
        //WRITE IMAGE TO STORAGE AS POSTHASH.WEBP
        //CHANGE IMGURL
        var newImgURL = ""; //INVOKE IMGURL AS POST'S IMGURL
        posts.push({
            author: req.body['author'],
            description: req.body['description'],
            category: req.body['category'],
            label: req.body['label'],
            link: req.body['link'],
            datetime: req.body['datetime'],
            imgurl: req.body['imgurl'],
            posthash: hash(req.body['author']+req.body['description'])
        });
        console.log(posts[posts.length-1]);
        res.sendStatus(200);
    } catch(e) {
        res.statusMessage = e;
        res.sendStatus(400);
    }
});

app.get('/signup', (req, res)=>{
    console.log(req.url);
    res.render("signup",  {title: "Signup - Budol Finds"});
});

app.get('/profile', (req, res)=>{
    console.log(req.url);
    res.render("profile",  {title: "{{user}} - Budol Finds"});
});

app.get('/profile_settings', (req, res)=>{
    console.log(req.url);
    res.render("profile_settings",  
        {
            title: "Profile Settings - Budol Finds",
            currentUser: currentUser,
            helpers:{

            }
        });
});

app.get('/post', (req, res)=>{
    console.log(req.url);
    res.render("post",  {title: "{{user}} - Budol Finds"});
});

//404
app.use((req, res, err) => {;
    res.render("err", {
        title: "Error - Budol Finds",
        errID: "404",
        errMsg: "Nothing to see here..."
    });
});

app.listen(PORT, ()=>{
    console.log("This is app.js\nListening @ " + PORT);
});

function checkData(){
    console.log("app.checkData() > Users: ");
    console.log(utils.users);

    console.log("app.checkData() > Posts: ");
    console.log(utils.posts);

    console.log("app.checkData() > Comments: ");
    console.log(utils.comments);
    
    console.log("app.checkData() > CurrentUser: ");
    console.log(utils.currentUser);
}