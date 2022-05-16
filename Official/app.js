console.log("App.js");

//Import modules
const express = require('express');
const hbs = require('express-handlebars');

//Create server object
const app = express();

//PORT NUMBER
const PORT = process.env.PORT || 3000;

//Set static folder
app.use(express.static(__dirname + "/public"));

//Set hbs as view engine
app.engine("hbs", hbs.engine({extname: "hbs"}));
app.set("view engine", "hbs");
app.set("views", "./views");

//Set view cache
app.set("view cache", false);

//App Listens
app.listen(PORT,()=>{
    console.log("localhost:" + PORT);
});

//Index Route
app.get("/", (req, res)=>{
    res.sendStatus(200);
});

//Other Routes