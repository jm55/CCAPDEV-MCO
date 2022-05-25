console.log("home.js loaded");

/*MAIN*/

var newPostClicked = false;

$(document).ready(()=>{
    //SHOW ITEM CATEGORIES; Reference: https://stackoverflow.com/a/590219
    let list = [];
    $(".menu_categories").each(function(){ list.push($(this).val());});
    
    //EVENTLISTERNERS / ACTIONLISTENERS
    $("#new-post-btn").click((e)=>{
        var newPost = null;
        newPostClicked = true;
        updateColor();
        if(validateNewPost()){
            newPost = createPost();
            newPostClicked = false;
            submitPost(newPost);
            clearInputs();
        }else
            errMessage("","New Post Data Incomplete");
    });

    $("#new-post-img-select").on("change",()=>{
        refreshNewPostImage();
    });

    $("#new-post-cancel-btn").click((e)=>{
        newPostClicked = false;
        clearInputs();
        updateColor(true); //Restores text box for value triggered input BG color.
    });

    $("#new-post-form").change((e)=>{
        if(newPostClicked)
            updateColor();
    });

    $("#new-post-category").on("change", (e)=>{
        var cat = document.getElementById("new-post-category").value;
        console.log("new post category: " + cat);
    });
});

function submitLike(id, posthash){
    console.log("Like: " + posthash + " from " + id); 
}

function submitShare(id, posthash){
    console.log("Share: " + posthash + " from " + id); 
}

function submitReport(id, posthash){
    console.log("Report: " + posthash + " from " + id); 
}

function submitComment(id, posthash){
    console.log("Comment: " + posthash + " from " + id); 
}

function submitPost(post){
    fetch("/post/new",{
        method: "POST",
        body: JSON.stringify(post),
        headers:{
            "Content-Type": "application/json"
        }
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

function validateNewPost(){
    var form = new FormData(document.forms.newPostForm);
    var validity = true;
    for(var f of form){
        if(f[0] == "new-post-img-select" && !getInputFile("new-post-img-select"))
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
 * Prints err message on console
 * Use for silent invalid input messages
 * @param {string}functionName Name offunction that called this. Don't include '()'
 * @param {string} msg Details of error
 */
function errMessage(functionName, msg){
    console.error(functionName + "(): ", msg);
}

/**
 * Updates background colors of inputs found on specified form.
 * Form specified: document.forms.newPostForm
 * @param {boolean} restore Set true if will set all input BG color as normal, otherwise it will mark empty inputs as red. Default as false
 */
function updateColor(restore=false){
    if(restore){
        for(f of new FormData(document.forms.newPostForm))
            if(f[0] == "new-post-category"){
                changeBGColor(f[0], "var(--primary-button)");
            }
            else if(f[0] != "new-post-img-select")
                changeBGColor(f[0], "var(--textbox)");
            else
                changeBGColor(f[0], "var(--primary)");
    }else{
        for(f of new FormData(document.forms.newPostForm)){
            if(f[0] == "new-post-category"){
                changeBGColor(f[0], "var(--primary-button)");
            }
            else if(f[0] != "new-post-img-select")
                changeBGColor(f[0], "var(--textbox)");
            else
                changeBGColor(f[0], "var(--primary)");

            if(f[1] == "")
                changeBGColor(f[0], "var(--warning-light)");
            else if(!getInputFile("new-post-img-select"))
                changeBGColor("new-post-img-select", "var(--warning-light)");
        }
    }
    
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
 * Clears the "Create Post" input fields
 */
 function clearInputs(){
    var inputPostDesc = document.getElementById('new-post-content');
    inputPostDesc.value = '';

    var inputPostCat = document.getElementById('new-post-category');
    inputPostCat.value = '';

    var inputPostLab = document.getElementById('new-post-label');
    inputPostLab.value = '';

    var inputPostLink = document.getElementById('new-post-link');
    inputPostLink.value = '';

    var inputPostImgSel = document.getElementById('new-post-img-select');
    inputPostImgSel.value = '';

    var inputPostImg = document.getElementById('new-post-image');
    refreshNewPostImage();
 }

/**
 * Creates a single Post object
 * @returns Post object
 */
 //TODO: when creating a new post, the link and category are aligned differently from the pre-created posts
 function createPost(){
    //author, description="", category="", label="", link="", imgurl="", posthash="", datetime = new Date()
    var p = {};
    const id = $("#new-post-form").attr("author");
    p['author'] = id;
    const description = document.getElementById("new-post-content").value;
    p['description'] = description;
    p['category']= document.getElementById("new-post-category").value;
    p['imgurl'] = getTempURL(getInputFile("new-post-img-select"), id);
    p['label'] = document.getElementById("new-post-label").value;
    p['link'] = document.getElementById("new-post-link").value;
    p['datetime'] = new Date();
    return p;
}

function hash(s) {
    /* Simple hash function. */
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        /*jshint plusplus:false bitwise:false*/
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a);
}

/**
 * Refreshes New Post Image Element
 * Either shows the element if an image (if there exists a selected file) or not (if otherwise).
 */
 function refreshNewPostImage(){
    var file = getInputFile("new-post-img-select");
    if(file){ //check if it exists
        document.getElementById("new-post-image").style.display = "block";
        $("#new-post-image").attr("src",getTempURL(file));
    }else{
        document.getElementById("new-post-image").style.display = "none";
        $("#new-post-image").attr("src",getTempURL(file));
        errMessage("refreshDP", "Error with file");
    }
}