console.log("post.js loaded!");

var inputid = [];

/**"Main"*/
$(document).ready(()=>{
    inputid = gatherInputIDs("new-post-form");
    console.log(inputid);
    $("#post-btn").click(()=>{
        submitPost();
    });
    $("#cancel-btn").click(()=>{
        cancelPost();
    });
});

/**
 * Collects information submitted by the user.
 * @returns 
 */
function submitPost(){
    console.log("submitPost()");
    var content = [];
    for(i of inputid){

        //Check for image input from input id:  img-btn

        let c = $("#"+i).val();
        content.push({[i]:c});
    }
    return content;
}

/**
 * Discards new post and redirects user to home.
 */
function cancelPost(){
    window.location.href = "../html/home.html"
}

/**
 * Automatically gathers all input IDs from a specified form id.
 * Remember that input ids should not have "#" id indicator.
 * @param formID Form ID that would be used for gathering inputIDs.
 * @returns Array of input IDs which include input types (except button), textarea, and select.
 */
function gatherInputIDs(formID){
    let signupInputs = [$("#" + formID).children("input").toArray(), $("#" + formID).children("textarea").toArray(), $("#" + formID).children("select").toArray()];
    let collection = [];
    for(s of signupInputs){
        for(i of s)
            if(i.type !== "button")
                collection.push(i.id);

    }
    return collection;
}