console.log("post.js");

$(document).ready(()=>{
    //Update selected value of gender in select
    var cat = $("#post-category").attr("value");
    $("#post-category").val(cat);

    $("#save-post-btn").click((e)=>{
        e.preventDefault();
        console.log("#save-post-btn");
        submitEditedPost(savePost());
    });
    $("#delete-post-btn").click((e)=>{
        e.preventDefault();
        console.log("#delete-post-btn");
        if(confirm("Delete this post?")){
            console.log("Post will be deleted");
            //Delete post here
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
        console.log("cancel-edit-post");
    });
    $("#imgselect").on("change",()=>{
        console.log("image change");
        refreshNewPostImage();
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
 * Refreshes New Post Image Element
 * Either shows the element if an image (if there exists a selected file) or not (if otherwise).
 */
 function refreshNewPostImage(){
    var file = getInputFile("imgselect");
    if(file){ //check if it exists
        document.getElementById("image").style.display = "block";
        $("#image").attr("src",getTempURL(file));
    }else{
        document.getElementById("image").style.display = "none";
        $("#image").attr("src",getTempURL(file));
        errMessage("refreshDP", "Error with file");
    }
}

/**
 * Simple Hash Function (for emulation purposes)
 * Reference: https://gist.github.com/iperelivskiy/4110988
 * @param {string} s String to be hashed
 * @returns Numeric hash string equivalent of s
 */
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