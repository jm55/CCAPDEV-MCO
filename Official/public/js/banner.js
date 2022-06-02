console.log("Public JS: banner.js loaded");

/**
 * @todo ADD FUNCTIONALITIES MISSING
 */
$(document).ready(()=>{
    var cat = $("#categories").attr("value");
    $("#categories").val(cat);


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
        window.location.href = "/profile/settings"
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
        search();
    });

    $("#search-txt").keyup((e)=>{
        e.preventDefault();
        if(e.key=="Enter"){
            console.log("#search-txt");
            search();
        }
    });
});

function search(){
     /**
     * 
     * 
     * CONDUCT SEARCH FOR SEARCH
     * ADD SEARCH TEXT AND CATEGORY TO REQ.BODY
     * USE ROUTE /home/search
     * 
     * 
     */
}   