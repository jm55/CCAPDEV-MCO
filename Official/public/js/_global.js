/**
 * ======================================================================
 * 
 *                              GLOBAL JS
 * 
 *      THIS JS FILE CONTAINS FUNCTIONS THAT CAN BE USED FOR 
 *      FUNCTIONS THAT ARE REUSABLE REGARDLESS OF PAGE.
 * 
 *      CURRENTLY, THIS IS NOT IMPORTABLE TO OTHER JS SINCE 
 *      WE ARE STILL NOT USING NODEJS.
 * 
 *      FOR NOW, SIMPLY GRAB A COPY OF THE FUNCTION NEEDED AND PASTE IT
 *      ON THE JS FILE THAT NEEDS IT.
 * 
 * ======================================================================
 */


/**
 * Counts the length value of an text.
 * @param limit (Optional) Text length limit. Default: 255 characters.
 * @param alert (Optional) Enable or disable alert pop-ups. Default: true.
 */
 function updateTextCount(limit=255, alert=true){
    let n = $("#bio").val().length;
    let s = "";
    if(n >= limit)
        s = limit + "/" + limit;
    else
        s = n + "/" + limit;
    
    $("#bio-counter").text(s);
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
 * SAVE BLOB OBJECT AS FILE TO SPECIFIED PATH
 * SERVER INTERACTION ONLY AND NOT FOR USER
 * @param {Blob} blob 
 * @param {string} path 
 */
function saveFile(blob, path){
    //CODE HERE
}

/**
 * Prints err message on console
 * Use for silent invalid input messages
 * @param {string} functionName Name of function that called this. Don't include '()'
 * @param {string} msg Details of error
 */
function errMessage(functionName, msg){
    console.log(functionName + "(): ", msg);
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

/**
 * Carried over from HO3 trigges a scan of the form specified (unfortunately, it is hardcoded)
 */
 function updateColor(){
    for(f of new FormData(document.forms.signupform)){
        if(!(f[0]=="bio" || f[0]=="profilepic-select")){
            if(f[1] == "")
                changeBGColor(f[0], "var(--warning-light)");
            else
                changeBGColor(f[0], "var(--textbox)");
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
 * Returns the user object from the given userList 
 * using the userID as the target reference.
 * @param {*} userID 
 * @param {*} userList 
 * @returns User object that equates to userID from userList. Returns null if no match is found.
 */
 function getUser(userID, userList){
    for(u of userList)
        if(userID == u.userID)
            return u;
    return null;
}