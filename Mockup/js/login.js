console.log("login.js loaded!");

/**"Main" */
$(document).ready(()=>{
    console.log("jquery.js");

    $("#signup-btn").click(()=>{
        redirectSignup();
    });

    $("#login-btn").click(()=>{
        login();
    });
});

/**
 * Redirects user to signup.html
 */
function redirectSignup(){
    window.location.href = "../html/signup.html"
}

/**
 * Process entire login process
 * @returns Null if user credentials are invalid, redirects user to home otherwise.
 */
function login(){
    var uname = $("#username").val();
    var pwrd = $("#password").val();

    if(uname.length === 0 && pwrd.length === 0) //invalidate entry if no credentials were presented/inputted
        return null;

    console.log("Parsing credentials");
    alert("!Temporary ACK!\nCredentials: " + uname +"=>" + pwrd);

    //PROCESS FOR PROPER LOGGING IN OF USER
    if(true)
        window.location.href = "../html/home.html"; 
}