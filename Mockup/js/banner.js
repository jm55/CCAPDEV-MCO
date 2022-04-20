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
});