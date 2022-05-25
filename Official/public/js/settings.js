console.log("settings.js loaded!");

/* MAIN */
var submitClicked = false;
$(document).ready(()=>{
    console.log(currentUser);

    //Update selected value of gender in select
    var gender = $("#gender").attr("value");
    $("#gender").val(gender);

    $("#bio-counter").text("0/255"); //default max value for bio characters

    $("#cancel-btn").click(()=>{
        console.log("#cancel-btn");
        homeRedirect();
    });

    $("#delete-btn").click(()=>{
        console.log("#delete-btn");
        if(confirm("Do you want to close the account?")){
            if(hash(document.getElementById("password_current").value)==currentUser.password){
                window.location.href = "/";
            }else{
                alert("Enter current password to confirm account deletion.");
            }
        }
    });

    $("#bio").keydown(()=>{
        updateTextCount();
    });

    $("#profilepic-select").on("change", ()=>{
        refreshDP();
    });

    $("input").keyup((e)=>{
        if(submitClicked)
            updateColor();
    });

    $("#gender").on("change",(e)=>{
        console.log("#gender");
    });

    $("select").on("change",(e)=>{
        if(submitClicked)
            updateColor();
    });

    $("#save-btn").keyup((e)=>{
        updateColor();
    });
});

function updateProfile(profile){
    console.log(profile);
    fetch("/profile_settings/update",{
        method: "POST",
        body: JSON.stringify(profile),
        headers:{
            "Content-Type": "application/json"
        }
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            window.location.href = '/profile';
        } else {// ERROR
            console.log("response error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

function saveProfile(userid){    
    if(validateProfileInputs()){
        var updatedUser = null;
        var username = document.getElementById("username").value;
        var email = document.getElementById("email").value;
        var fname = document.getElementById("fname").value;
        var mname = document.getElementById("mname").value;
        var lname = document.getElementById("lname").value;
        var gender = document.getElementById("gender").value;
        var bio = document.getElementById("bio").value;
        
        var URL = getTempURL(getInputFile("profilepic-select"));
        var profilepic = "";
        if(URL)
            profilepic = URL; //TEMPORARILY USING BLOBURL
        else
            profilepic = currentUser.profilepic;
        
        var password = "";
        if(document.getElementById("password_b").value.length > 0)
            password = hash(document.getElementById("password_b").value); //RECOMMENDED TO BE IN HASH
        else
            password = hash(document.getElementById("password_current").value); //RECOMMENDED TO BE IN HASH
    
        updatedUser = { userId: String(userid), username:username, password:password, 
                        email:email, fname:fname, mname:mname, 
                        lname:lname, gender:gender, bio:bio, 
                        profilepic:profilepic};
    
        updateProfile(updatedUser);
    }else{
        console.log("inputs missing");
    }
}

/**
 * Refreshes displayed User picture if file is selected; Uses tempURL/blobURL as placeholder for file
 */
 function refreshDP(){
    var file = getInputFile("profilepic-select");
    if(file) //check if it exists
        $("#profilepic").attr("src",getTempURL(file));
    else
        errMessage("refreshDP", "Error with file");
}

/**
 * Retrieves inputted signup data from profileform.
 * @returns Key-Value pair of all IDs available from @var idlist;
 */
function validateProfileInputs(){
    var form = new FormData(document.forms.profileform);
    var validity = true;
    var validCurrentPassword = false;
    var newPasswordA = "";
    for(f of form){ 
        if(f[1].length == 0){
            if(f[0] != "bio" && f[0] != "profilepic-select" && f[0] != "password_a" && f[0] != "password_b"){
                errMessage("validateSignupInputs",  f[0] + " not filled");
                validity = false;
            }
        }
        //CHECK EMAIL IF IT CONTAINS AT LEAST AN @
        if(f[0] == "email"){
            if(!f[1].includes("@")){
                errMessage("validateSignupInputs", "Invalid email");
                validity = false;
            }
        } 
        
        //CHECK PASSWORD IF SAME, RECOMMENDED TO BE HASHED BEFORE COMPARING
        if(f[0] == "password_current"){
            if(currentUser.passhash == hash(f[1])){
                validCurrentPassword = true;
            }
            else{
                validity = false;
                errMessage("validateSignupInputs",  f[0] + " not filled");
                alert("Incorrect Current Password");
            }
        }

        //CHECK IF THERE IS AN ATTEMPT FOR NEW PASSWORD
        if(f[0] == "password_a" && f[1].length != 0 && validCurrentPassword){
            newPasswordA = hash(f[1]);
        }
        if(f[0] == "password_b" && validCurrentPassword && newPasswordA){
            if(f[1].length != 0){
                if(hash(f[1]) != newPasswordA && validCurrentPassword){
                    validity = false;
                    alert("New Passwords mismatch, please try again");
                }
            }else{
                validity = false;
            }
        }
            
        //CHECK BIO IF AT 255 CHAR AT MOST
        if(f[0] == "bio")
            if(f[1].length > 255){ //BIO CHAR LIMIT
                errMessage("validateSignupInputs", "Bio char limit exceeded");
                validity = false;
            }
    }
    updateColor();
    return validity;
}

/**
 * Sets the error message with the passed id back to its default value.
 * @param id ID of the error message to change, minue the "error-" part.
 */
 function setDefaultErrorMessage(id){
    let errorMessage;
    switch(id){
        case "profilepic-select": 
            errorMessage = "* Upload a Profile Picture";
            break;
        case "username":
            errorMessage = "* Enter a username";
            break;
        case "password_current":
            errorMessage = "* Wrong current password";
            break;
        case "password_b":
            errorMessage = "* Confirm your new password";
            break;
        case "email":
            errorMessage = "* Enter your email";
            break;
        case "fname":
            errorMessage = "* Enter your first name";
            break;
        case "mname":
            errorMessage = "* Enter your middle name";
            break;
        case "lname":
            errorMessage = "* Enter your last name";
            break;
        case "gender":
            errorMessage = "* Select a gender";
            break;
        case "bio":
            errorMessage = "* Enter a bio";
            break;
    }
    $("#error-" + id).text(errorMessage);
}

/**
 * Clears the values of all inputs listed from idlist.
 * @param ids (Optional) you can specify the list ids to be cleared, uses idlist by default.
 * @returns 0 as basic confirmation.
 */
function clearSignup(){
    var form = new FormData(document.forms.signupform);
    for(f of form)
        $("#" + f[0]).val("");
    submitClicked = false;
}

function homeRedirect(){
    window.location.href = "/profile";
}

/*
===================================================================================

TRANSFERRABLE/GLOBAL METHODS

===================================================================================
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
    let tempURL = "";
    if(file)
        tempURL = URL.createObjectURL(file);
    return tempURL;
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
 * @param {string} functionName Name of function that called this. Don't include '()'
 * @param {string} msg Details of error
 */
function errMessage(functionName, msg){
    console.log(functionName + "(): ", msg);
}

/**
 * Simple Hash Function (For Emulation Purposes)
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
    var newPasswordA = false; //TO BE USED IF TO FLAG PASSWORD_B
    for(f of new FormData(document.forms.profileform)){
        if(f[0] == "password_a" && f[1].length > 0) //NEW PASSWORD_A WAS SET
            newPasswordA = true;
        if(!(f[0]=="bio" || f[0]=="profilepic-select" || f[0]=="password_a")){
            if(newPasswordA && f[1] == ""){
                changeBGColor(f[0], "var(--warning-light)");
                setDefaultErrorMessage(f[0]);
            }
            else if(f[1] == "" && f[0] != "password_b"){
                changeBGColor(f[0], "var(--warning-light)");
                setDefaultErrorMessage(f[0]);
            }else{
                changeBGColor(f[0], "var(--textbox)");
                $("#error-" + f[0]).text("");
            }
        }
        if(f[0]=="password_current" && hash(f[1])!=currentUser.passhash){
            changeBGColor(f[0], "var(--warning-light)");
            setDefaultErrorMessage(f[0]);
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