console.log("Public JS: home.js loaded");

/*MAIN*/

var newPostClicked = false;

$(document).ready(()=>{
    //SHOW ITEM CATEGORIES; Reference: https://stackoverflow.com/a/590219
    //let list = [];
    //$(".menu_categories").each(function(){ list.push($(this).val());});
    $("#cancel-btn").click((e)=>{
        newPostClicked = false;
        clearInputs();
        updateColor(true); //Restores text box for value triggered input BG color.
    });

    $("#form").change((e)=>{
        if(newPostClicked)
            updateColor();
    });

    $("#category").on("change", (e)=>{
        // @ts-ignore
        var cat = document.getElementById("category").value;
        console.log("new post category: " + cat);
    });
});