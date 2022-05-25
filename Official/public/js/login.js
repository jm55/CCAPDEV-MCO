console.log("login.js loaded!");

var sampleKeys = [{"username":"dlsu","password":"237392540"}];

/**"Main" */
$(document).ready(()=>{
    console.log("jquery.js");

    $("#signup-btn").click(()=>{
        redirectSignup();
    });

    $("#login-btn").click((e)=>{
        e.preventDefault();
        login();
    });
    $("#password").keyup((e)=>{
        e.preventDefault();
        if(e.key === "Enter")
            login();
    });
    $("#username").keyup((e)=>{
        e.preventDefault();
        if(e.key === "Enter")
            login();
    });
});

function redirectSignup(){
    window.location.href = "/signup"
}

function auth(uname, pwrd){
    console.log(auth);
    const key = {username:uname, password:pwrd};
    fetch("/login/in",{
        method: "POST",
        body: JSON.stringify(key),
        headers:{
            "Content-Type": "application/json"
        }
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS

            //CHECK AUTHENTICATION HERE

            window.location.href = '/home';
        } else {// ERROR
            alert("Error ocurred while logging in.");
            window.location.href = '/login';
        }
    }).catch((error) => {
        console.error(error);
        alert("Error ocurred while logging in.");
        window.location.href = '/login';
    });
}

function login(){
    var formData = new FormData(document.forms.loginform);
    
    for (let f of formData)
        $("#" + f[0]).css("background-color", "rgba(255,255,255,30%)");

    var counter = checkEmpty(formData);
    var c = listEntries(formData);

    //HASH C[1] IMMEDIATELY; USE BCRYPT FOR HASHING 

    if(counter === 0) //No empties
        auth(c[0], c[1]);
    else if(counter === 2){ //Both empties
        errMessage("login", "Username and password are missing.")
    }
    else{ //1 field empty
        if($("#username").val() == ""){
            errMessage("login", "Username is missing.");
        }
        else{
            errMessage("login", "Password is missing.");
        }
    }
}

function checkEmpty(formData){
    //Count for empty inputs
    let counter = 0;
    for(let x of formData)
        if(x[1] == "")
            counter++;
    return counter;
}

function listEntries(formData){
    var c = [];
    for(let f of formData)
        if(f[1].length === 0)
            $("#" + f[0]).css("background-color", "var(--warning-light)");
        else
            c.push(f[1]);
    return c;
}

/**
 * Simple Hash Function (for emulation purposes)
 * Reference: https://gist.github.com/iperelivskiy/4110988
 * @param {string} s String to be hashed
 * @returns Numeric hash string equivalent of s
 */
 function hash(s) {
    /* Simple hash function. */
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        /*jshint plusplus:false bitwise:false*/
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a);
}

/**
 * Prints err message on console
 * Use for silent invalid input messages
 * @param {string} functionName Name of function that called this. Don't include '()'
 * @param {string} msg Details of error
 */
 function errMessage(functionName, msg){
    $("#errorText").text("* " + msg);
    console.error(functionName + "(): ", msg);
}