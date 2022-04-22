console.log("banner.js loaded");

$(document).ready(()=>{
    $("#home-btn").click(()=>{
        console.log("#home-btn clicked");
        window.location.href = "../html/home.html";
    });
    $("#new-post-btn").click(()=>{
        console.log("#post-btn clicked");
        window.location.href = "../html/post.html";
    });
    $("#search-btn").click(()=>{
        console.log("#search-btn clicked");
    });
    $("#categories").on("change", ()=>{
        console.log("categories selected value changed: " + $("#categories").val());
    });
    $("#userbutton").click(()=>{
        console.log("#userbutton clicked");
        window.location.href = "../html/profile.html";
    });
    $("#account-settings-btn").click(()=>{
        console.log("#account-settings-btn clicked");
        window.location.href = "../html/profile_settings.html"
    });
    $("#logout-btn").click(()=>{
        console.log("#logout-btn clicked");
        if(logOut()){
            console.log("logOut() returned true");
            window.location.href = "../html/login.html";
        }
        else{
            console.log("logOut() returned false");
            return null;
        }
    });
});

/**
 * Logout protocols
 * @returns Return true if successfully logged out, false if otherwise.
 */
function logOut(){
    //[LOGOUT PROCEDURE HERE]

    alert("!Temporary!\nLOGOUT ACK");
    console.log("Logging out user...");
    return true;
}