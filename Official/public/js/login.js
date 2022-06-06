console.log("Public JS: login.js loaded!");

var sampleKeys = [{"username":"dlsu","password":"237392540"}];

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
    const key = {username:uname, password:pwrd};
    fetch("/login/in",{
        method: "POST",
        body: JSON.stringify(key),
        headers:{"Content-Type": "application/json"},
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCES
            return res.json();
        } else {// ERROR
            alert("Error ocurred while logging in.");
            window.location.href = '/login';
        }
    }).then(data=>{ //Reference: https://stackoverflow.com/a/56903161
        if(data)
            if(data['success']){
                //SET SESSION FOR USER
                window.location.href='/';
            }else{
                alert("Invalid username or password");
                window.location.href='/login';
            }
    }).catch((error) => {
        console.error(error);
        alert("Error ocurred while logging in.");
        window.location.href = '/';
    });
}

function login(){
    var formData = new FormData(document.forms.loginform);
    
    for (let f of formData)
        $("#" + f[0]).css("background-color", "rgba(255,255,255,30%)");

    var counter = checkEmpty(formData);
    var c = listEntries(formData);

    if(counter === 0)
        auth(c[0], c[1]);
    else if(counter === 2){
        errMessage("login", "Username and password are missing.")
    }
    else{
        if($("#username").val() == ""){
            errMessage("login", "Username is missing.");
        }
        else{
            errMessage("login", "Password is missing.");
        }
    }
}

function checkEmpty(formData){
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

function errMessage(functionName, msg){
    $("#errorText").text("* " + msg);
    console.error(functionName + "(): ", msg);
}