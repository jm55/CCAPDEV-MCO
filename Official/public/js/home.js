console.log("Public JS: home.js loaded");

var newPostClicked = false;

$(document).ready(()=>{
    $("#cancel-btn").click((e)=>{
        newPostClicked = false;
        clearInputs();
        updateColor(true);
    });

    $("#form").change((e)=>{
        if(newPostClicked)
            updateColor();
    });

    $("#category").on("change", (e)=>{
        var cat = document.getElementById("category").value;
        console.log("new post category: " + cat);
    });
});