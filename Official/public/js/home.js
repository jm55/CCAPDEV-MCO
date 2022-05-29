console.log("Public JS: home.js loaded");

/*MAIN*/

var newPostClicked = false;

$(document).ready(()=>{
    //SHOW ITEM CATEGORIES; Reference: https://stackoverflow.com/a/590219
    //let list = [];
    //$(".menu_categories").each(function(){ list.push($(this).val());});
    
    //EVENTLISTERNERS / ACTIONLISTENERS
    $("#post-btn").click((e)=>{
        var newPost = null;
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

    $("#imgselect").on("change",()=>{
        if(refreshNewPostImage())
            changeBGColor("imgselect", "var(--primary)");
    });

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
 * Form specified: document.forms.form
 * @param {boolean} restore Set true if will set all input BG color as normal, otherwise it will mark empty inputs as red. Default as false
 */
function updateColor(restore=false){
    if(restore){
        for(f of new FormData(document.forms.form))
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
    var inputPostDesc = document.getElementById('content');
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