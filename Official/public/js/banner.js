console.log("banner.js loaded");

/**
 * ONLY CONTAINS REDIRECTS AND NOT SEARCH/FILTERS
 */

$(document).ready(()=>{
    $("#home-btn").click(()=>{
        console.log("#home-btn clicked");
        window.location.href = "/home";
    });
    $("#userbutton").click(()=>{
        console.log("#userbutton clicked");
        window.location.href = "/profile";
    });
    $("#account-settings-btn").click(()=>{
        console.log("#account-settings-btn clicked");
        window.location.href = "/profile_settings"
    });
    $("#logout-btn").click(()=>{
        console.log("#logout-btn clicked");
        window.location.href = "/logout";
    });

    $("#categories").on("change", (e)=>{
        var cat = document.getElementById("categories").value;
        console.log("menu category: " + cat);
    });

    $("#search-btn").click((e)=>{
        console.log("#search-btn");
    });

    $("#search-txt").keyup((e)=>{
        e.preventDefault();
        if(e.key=="Enter"){
            console.log("#search-txt");
        }
    });
});

/**
 * Logout protocols
 * @returns Return true if successfully logged out, false if otherwise.
 */
function logout(currentUser){
    return true;
}