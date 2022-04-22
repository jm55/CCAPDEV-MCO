console.log("settings.js loaded");

var idlist = [];

$(document).ready(()=>{
    idlist = gatherInputIDs("profileform");
    console.log(idlist);

    $("#bio-counter").text("0/255");
    $("#save").click(()=>{
        getInputs();
    });
    $("#cancel").click(()=>{
        window.location.href = "../html/profile.html";
    });
    $("#bio").keyup(()=>{
        console.log("bio keyup");
        textCount();
    });
});

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

/**
 * Retrieves inputted signup data from signupform.
 * @returns Key-Value pair of all IDs available from @var idlist;
 */
 function getInputs(){
    console.log("getInputs()!");
    var collection = [];
    let p = "";
    for(i of idlist){
        let v = $("#"+i).val();
        if(i==="new_password")
            p = v;
        console.log(i + ":" + v);
        if(v.length===0 && (i!=="bio" && i!=="profilepic-select")){ //Checks for empty input fields except for profilepic and bio which are optional.
            alert("You have missing required inputs.");
            return null;
        }
        if(v.length>255 && i==="bio"){ //Bio length limitation
            alert("You have exceeded 255 characters for the bio.");
            return null;
        }
        if(i==="new_password2" && p !== v){
            alert("Password do not match, try again.");
            return null;
        }
        collection.push({[i]:v});
    }
    alert("Check console for data retrieval!");
    console.log(collection);
}

/**
 * Clears the values of all inputs listed from idlist.
 * @param ids (Optional) you can specify the list ids to be cleared, uses idlist by default.
 * @returns 0 as basic confirmation.
 */
 function clearSignup(ids = idlist){
    console.log("clearSignup()!");
    for(i of ids)
        $("#"+i).val("");
    return 0;
}

/**
 * Counts the length value of an text.
 * @param limit (Optional) Text length limit. Default: 255 characters.
 * @param alert (Optional) Enable or disable alert pop-ups. Default: true.
 */
 function textCount(limit=255, alert=true){
    let n = $("#bio").val().length;
    let s = n + "/" + limit;
    $("#bio-counter ").text(s);
    if(limit-n < 0)
        if(alert)
            alert("You have exceeded " + limit + " of characters.");   
}