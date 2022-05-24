console.log("home.js loaded");

/*MAIN*/

var newPostClicked = false;

$(document).ready(()=>{
    //SHOW ITEM CATEGORIES; Reference: https://stackoverflow.com/a/590219
    let list = [];
    $("#new-post-category option").each(function(){ list.push($(this).val());});
    
    //EVENTLISTERNERS / ACTIONLISTENERS
    $("#new-post-btn").click((e)=>{
        newPost();
    });

    $("#new-post-img-select").on("change",()=>{
        console.log("#new-post-img-select");
    });

    $("#new-post-cancel-btn").click((e)=>{
        console.log("#new-post-cancel-btn");
    });

    $("#new-post-form").change((e)=>{
        console.log("#new-post-form category");
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

    $("#categories").on("change", (e)=>{
        console.log("#categories");
    });
});

function newPost(){
    console.log("newPost()");
    const formData = new FormData(document.getElementById("new-post-form"));
    console.log(formData.getAll);
}