console.log("banner.js loaded");

/**
 * ONLY CONTAINS REDIRECTS AND NOT SEARCH/FILTERS
 */

$(document).ready(()=>{
    $("#home-btn").click(()=>{
        console.log("#home-btn clicked");
        window.location.href = "../html/home.html";
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
        if(logout(currentUser)){
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
function logout(curentUser){
    return true;
}