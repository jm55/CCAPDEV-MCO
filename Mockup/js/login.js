console.log("login.js loaded!");

//Redirects user to signup page.
function redirectSignup(){
    window.location.href = "../html/signup.html"
}

//Conducts login logic
function login(){
    var uname = document.getElementById("username").value;
    var pwrd = document.getElementById("password").value;

    if(uname.length === 0 && pwrd.length === 0) //invalidate entry if no credentials were presented/inputted
        return null;

    console.log("Parsing credentials");
    alert("!Temporary ACK!\nCredentials: " + uname +"=>" + pwrd);

    //PROCESS FOR PROPER LOGGING IN OF USER
    if(true)
        window.location.href = "../html/home.html"; 
}