console.log("post.js");
var newPostClicked = false;

$(document).ready(()=>{
    //Update selected value of gender in select
    var cat = $("#post-category").attr("value");
    $("#post-category").val(cat);

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

    $("#save-post-btn").click((e)=>{
        e.preventDefault();
        console.log("#save-post-btn");
        submitEditedPost(savePost());
    });

    $("#delete-post-btn").click((e)=>{
        e.preventDefault();
        console.log("#delete-post-btn");
        if(confirm("Delete this post?")){
            /***
             * 
             * 
             * DELETE POST HERE
             * 
             */
        }else{
            //Route back to home
            window.location.href = "/home";
        }
        console.log("delete-post");
    });

    $("#cancel-post-btn").click((e)=>{
        e.preventDefault();
        //Route back to profile page
        window.location.href = "/profile";
        console.log("cancel-post-btn");
    });
    
    $("#imgselect").on("change",()=>{
        if(refreshNewPostImage())
            changeBGColor("imgselect", "var(--primary)");
    });
});

function submitEdit(){
    console.log("Edit Post");
    var fetchURL = "/post/" + currentPost.posthash + "/save";
    var f = new FormData(document.forms.form);
    fetch(fetchURL,{
        method: "POST",
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
            location.reload();
        } else {// ERROR
            console.log("response error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

function validatePost(){
    var form = new FormData(document.forms.form);
    var validity = true;
    for(var f of form){
        if(f[0] == "imgselect" && !getInputFile('imgselect'))
            validity = false;
        else if(f[1] == "")
            validity = false;
    }
    return validity;
}

/**
 * Get a TempURL for use for displaying images even if file is not yet sent to server.
 * Recommended to be used with getInputFile();
 * @param {File} file 
 * @returns Temporary blobURL (cache?) for file specified
 */
 function getTempURL(file){
    if(file)
        return URL.createObjectURL(file);
    return "";
}

/**
 * Retrieves the file object pointed to by and id-specified <input type="file"> element.
 * @param {string} id ID of input element
 * @returns First file available pointed by the element ID.
 */
 function getInputFile(id){
    //Reference: https://stackoverflow.com/a/15792918 & https://stackoverflow.com/a/4459419
    var inputFile = document.getElementById(id); //Get inputFile element
    var files = inputFile.files; //Get files of input
    return files[0]; //Returns only the first file
}

/**
 * Clears the "Create Post" input fields
 */
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

 /**
 * Updates background colors of inputs found on specified form.
 * Form specified: document.forms.form
 * @param {boolean} restore Set true if will set all input BG color as normal, otherwise it will mark empty inputs as red. Default as false
 */
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

/**
 * Prints err message on console
 * Use for silent invalid input messages
 * @param {string}functionName Name offunction that called this. Don't include '()'
 * @param {string} msg Details of error
 */
 function errMessage(functionName, msg){
    console.error(functionName + "(): ", msg);
}

/**
 * Changes the background color of an element, given its ID.
 * @param {string} id ID of target element
 * @param {string} color Background color of target element
 */
 function changeBGColor(id, color){
    document.getElementById(id).style.backgroundColor = color;
}

/**
 * Refreshes New Post Image Element
 * Either shows the element if an image (if there exists a selected file) or not (if otherwise).
 */
 function refreshNewPostImage(){
    var file = getInputFile("img-select");
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

/**
 * Prints err message on console
 * Use for silent invalid input messages
 * @param {string}functionName Name offunction that called this. Don't include '()'
 * @param {string} msg Details of error
 */
 function errMessage(functionName, msg){
    console.error(functionName + "(): ", msg);
}

/**
 * Changes the background color of an element, given its ID.
 * @param {string} id ID of target element
 * @param {string} color Background color of target element
 */
 function changeBGColor(id, color){
    document.getElementById(id).style.backgroundColor = color;
}