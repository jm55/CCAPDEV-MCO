console.log("signup.js loaded!");

const idlist = ["profilepic", "username", "new_password", "new_password2", "fname","mname","lname", "gender","bio"];

//Get inputted data from form
function getSignup(){
    console.log("getSignup()!");
    var collection = [];
    let ctr = 0;
    for(i of idlist){
        let v = document.getElementById(i).value;
        if(v.length===0 && (i!=="bio" && i!=="profilepic")){ //Checks for empty input fields except for profilepic and bio which are optional.
            alert("You have missing required inputs.");
            return null;
        }
        if(v.length>255 && i==="bio"){ //Bio length limitation
            alert("You have exceeded 255 characters for the bio.");
            return null;
        }
        collection[ctr] = v;
        ctr = ctr + 1;
    }
    alert("Check console for data retrieval!");
    console.log("format: " + idlist + "\noutput: " + collection);
}

function clearSignup(){
    console.log("clearSignup()!");
    for(i of idlist){
        document.getElementById(i).value = "";
    }
}

function loginRedirect(){
    window.location.href = "../html/login.html";
}