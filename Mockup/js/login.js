console.log("login.js loaded!");

//Redirects user to signup page.
function redirectSignup(){
    window.location.href = "../html/signup.html"
}

//Conducts login logic
function login(){
    console.log("Parsing credentials");
    var uname = document.getElementById("username").value;
    var pwrd = document.getElementById("password").value;
    alert("!Temporary ACK!\nCredentials: " + uname +"=>" + pwrd);

    //PROCESS FOR PROPER LOGGING IN OF USER
    if(true)
        window.location.href = "../html/home.html"; 
}