console.log("signup.js loaded!");

const idlist = ["profilepic", "username", "new_password", "new_password2", "fname","mname","lname", "gender","bio"];

$(document).ready(()=>{
    $("#bio-counter").text("0/255");
    $("#signup-btn").click(()=>{
        getSignup();
    });
    $("#login-btn").click(()=>{
        loginRedirect();
    });
    $("#clear-btn").click(()=>{
        clearSignup();
    });
    $("#bio ").keyup(()=>{
        bioCount();
    });
});

//Get inputted data from form
function getSignup(){
    console.log("getSignup()!");
    var collection = [];
    let ctr = 0;
    let p = "";
    for(i of idlist){
        let v = $("#"+i).val();
        if(i==="new_password")
            p = v;
        if(v.length===0 && (i!=="bio" && i!=="profilepic")){ //Checks for empty input fields except for profilepic and bio which are optional.
            alert("You have missing required inputs.");
            return null;
        }
        if(v.length>255 && i==="bio"){ //Bio length limitation
            alert("You have exceeded 255 characters for the bio.");
            return null;
        }
        if(i==="new_password2" && p !== v){
            alert("Password do not match, try again.");
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
        $("#"+i).val("");
    }
}

function loginRedirect(){
    window.location.href = "../html/login.html";
}

function bioCount(){
    let n = $("#bio").val().length;
    let s = n + "/255";
    $("#bio-counter").text(s);
    if(255-n < 0){
        alert("You have exceeded 255 characters for the bio.");
    }       
}