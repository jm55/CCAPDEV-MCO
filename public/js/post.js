console.log("Public JS: post.js");
var newPostClicked = false;

$(document).ready(()=>{
    var cat = $("#post-category").attr("value");
    $("#post-category").val(cat);
    $("#category").val($("#category").attr("value"));

    $("#post-btn").click((e)=>{
        newPostClicked = true;
        updateColor();
        if(validatePost()){
            submitPost();
            clearInputs();
        }else{
            alert("Please check completeness of post content.");
            errMessage("","New Post Data Incomplete");
        }
    });

    $("#save-btn").click((e)=>{
        e.preventDefault();
        if(validatePost(true)){
            submitEdit();
        }
    });

    $("#cancel-btn").click((e)=>{
        e.preventDefault();
        clearInputs();
    });

    $("#cancel-edit-btn").click((e)=>{
        e.preventDefault();
        if(confirm("Are you sure to cancel?"))
            window.location.href = '/';
    });

    $("#delete-btn").click((e)=>{
        e.preventDefault();
        if(confirm("Are you sure you want to delete?"))
            submitDelete();
    });
    
    $("#imgselect").on("change",()=>{
        if(refreshNewPostImage())
            changeBGColor("imgselect", "var(--primary)");
    });
});

function submitDelete(){
    console.log("Delete Post");
    var fetchURL = "/post/" + currentPost.postHash + "/delete";
    var f = {};
    f['postHash'] = currentPost.postHash;
    fetch(fetchURL,{
        method: "DELETE",
        body: JSON.stringify(f),
        headers:{'Content-Type':'application/json'},
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            window.location.href = '/profile';
        } else {// ERROR
            alert("Error deleting post, please try again.");
            console.log("response error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

function submitEdit(){
    console.log("Edit Post");

    var fetchURL = "/post/" + currentPost.postHash + "/save";
    var f = new FormData(document.forms.form);
    f.append('postHash', currentPost.postHash);
    fetch(fetchURL,{
        method: "PATCH",
        body: f,
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            window.location.href = '/profile';
        } else {// ERROR
            alert("Error saving post, please try again.");
            console.log("response error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

function submitPost(){
    console.log("Submit Post");
    var f = new FormData(document.forms.form);
    fetch("/post/new",{
        method: "POST",
        body: f,
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            window.location.reload();
        } else {// ERROR
            console.log("response error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

function validatePost(imageSkip=false){
    var form = new FormData(document.forms.form);
    var validity = true;
    for(var f of form){
        if(imageSkip){
            if(f[0] == "imgselect")
                validity = true;
            if(f[1] == "")
                validity = false;
        }else{
            if(f[0] == "imgselect" && !getInputFile('imgselect'))
                validity = false;
            if(f[1] == "")
                validity = false;
        }  
    }
    return validity;
}


function getTempURL(file){
    if(file)
        return URL.createObjectURL(file);
    return "";
}

function getInputFile(id){
    //Reference: https://stackoverflow.com/a/15792918 & https://stackoverflow.com/a/4459419
    var inputFile = document.getElementById(id);
    var files = inputFile.files;
    return files[0];
}

function clearInputs(){
    var inputPostDesc = document.getElementById('description');
    inputPostDesc.value = '';

    var inputPostCat = document.getElementById('category');
    inputPostCat.value = '';

    var inputPostLab = document.getElementById('label');
    inputPostLab.value = '';

    var inputPostLink = document.getElementById('link');
    inputPostLink.value = '';

    var inputPostImgSel = document.getElementById('imgselect');
    inputPostImgSel.value = '';

    var inputPostImg = document.getElementById('image');
    refreshNewPostImage();
 }


function updateColor(restore=false){
    if(restore){
        for(var f of new FormData(document.forms.form))
            if(f[0] == "category"){
                changeBGColor(f[0], "var(--primary-button)");
            }
            else if(f[0] != "imgselect")
                changeBGColor(f[0], "var(--textbox)");
            else
                changeBGColor(f[0], "var(--primary)");
    }else{
        for(f of new FormData(document.forms.form)){
            if(f[0] == "category"){
                changeBGColor(f[0], "var(--primary-button)");
            }
            else if(f[0] != "img-select")
                changeBGColor(f[0], "var(--textbox)");
            else
                changeBGColor(f[0], "var(--primary)");

            if(f[1] == "")
                changeBGColor(f[0], "var(--warning-light)");
            else if(!getInputFile('imgselect'))
                changeBGColor("imgselect", "var(--warning-light)");
        }
    }
}

function errMessage(functionName, msg){
    console.error(functionName + "(): ", msg);
}


function changeBGColor(id, color){
    document.getElementById(id).style.backgroundColor = color;
}


function refreshNewPostImage(){
    var file = getInputFile("imgselect");
    if(file){ //check if it exists
        document.getElementById("image").style.display = "block";
        $("#image").attr("src",getTempURL(file));
        return true;
    }else{
        document.getElementById("image").style.display = "none";
        $("#image").attr("src",getTempURL(file));
        errMessage("refreshDP", "Error with file");
        return false;
    }
}


 function errMessage(functionName, msg){
    console.error(functionName + "(): ", msg);
}

function changeBGColor(id, color){
    document.getElementById(id).style.backgroundColor = color;
}