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
    $("#post-img-select").on("change",()=>{
        console.log("image change");
        refreshNewPostImage();
    });
});

function submitEditedPost(post){
    console.log(post);
    var fetchURL = "/post/" + currentPost.posthash + "/save";
    fetch(fetchURL,{
        method: "POST",
        body: JSON.stringify(post),
        headers:{
            "Content-Type": "application/json"
        }
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

function savePost(){
    var p = {};
    const id = $("#post-form").attr("author");
    p['author'] = id;
    const description = document.getElementById("post-content").value;
    p['description'] = description;
    p['category']= document.getElementById("post-category").value;

    var URL = getTempURL(getInputFile("post-img-select"));
    if(URL)
        p['imgurl'] = URL; //TEMPORARILY USING BLOBURL
    else
        p['imgurl'] = currentPost.imgurl; //Refers to currentPostJSON from post.hbs

    p['label'] = document.getElementById("post-label").value;
    p['link'] = document.getElementById("post-link").value;
    p['datetime'] = new Date();
    console.log(p);
    return p;    
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
    var file = getInputFile("post-img-select");
    if(file){ //check if it exists
        document.getElementById("post-image").style.display = "block";
        $("#post-image").attr("src",getTempURL(file));
    }else{
        document.getElementById("post-image").style.display = "none";
        $("#post-image").attr("src",getTempURL(file));
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