console.log("post.js loaded!");

$(document).ready(()=>{
    $("#post-btn").click(()=>{
        submitPost();
    });
    $("#cancel-btn").click(()=>{
        cancelPost();
    });
    $("#post-category").on("change",()=>{
        console.log("#post-category.val changed: " + $("#post-category").val());
    });
});

const inputId = ["#post-content","#post-category", "#label", "#link","#img"];

function submitPost(){
    console.log("submitPost()");
    let content = [];
    for(i of inputId){
        let c = $(i).val();
        console.log(i + ": " +  c);
    }
}

function cancelPost(){
    window.location.href = "../html/home.html"
}