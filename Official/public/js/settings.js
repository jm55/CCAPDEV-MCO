console.log("Public JS: settings.js loaded!");

var validCurrentPassword = false, validity = true, newPassMismatch = false;

var submitClicked = false;
$(document).ready(()=>{
    ////console.log(currentUser);
    var gender = $("#gender").attr("value");
    $("#gender").val(gender);

    $("#bio-counter").text("0/255"); //default max value for bio characters

    $("#cancel-btn").click(()=>{
        //console.log("#cancel-btn");
        homeRedirect();
    });

    $("#delete-btn").click(()=>{
        //console.log("#delete-btn");
        if(confirm("Do you want to close the account?")){
            checkDeletion();
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
        //console.log("#gender");
    });

    $("select").on("change",(e)=>{
        if(submitClicked)
            updateColor();
    });

    $("#save-btn").keyup((e)=>{
        updateColor();
    });

    $("#save-btn").click((e)=>{
        e.preventDefault();
        saveProfile();
    });
});

function deleteAccount(){
    fetch('/profile/settings/delete',{
        method: 'DELETE',
        body: JSON.stringify({'userId': currentUser.userId}),
        headers: {'Content-Type':'application/json'},
    }).then((data)=>{
        if(data.status == 200){
            alert('Account successfully deleted!\nYou\'ll be redirected to the login page.');
            window.location.href = '/';
        }
    }).catch((error)=>{
        console.error('Error deleting account on DB');
        console.error(error);
    });
}

function checkDeletion(){
    var body = {};
    body['username'] = currentUser.username;
    body['password'] = String(document.getElementById('password_current').value);
    fetch("/validate/password",{
        method:'POST',
        body: JSON.stringify(body),
        headers:{ "Content-Type": "application/json"}        
    }).then((res)=>{
        ////console.log('res.json()');
        return res.json();
    }).then(data=>{
        ////console.log("match: " + data['match']);
        validCurrentPassword = data['match'];
    }).finally(()=>{
        ////console.log('finally: '+ validCurrentPassword);
        var a = document.getElementById("password_a").value;
        var b = document.getElementById("password_b").value;
        if(validCurrentPassword){
            if(a.length > 0 && b.length > 0){
                if(String(a)===(String(b))){
                    newPassMismatch = false;
                    validity = true;
                }else{
                    ////console.log("new pass mismatch");
                    newPassMismatch = true;
                    validity = false;
                }
            }else{
                ////console.log("no new password");
                validity = true;
            }
        }else{
            ////console.log("current password wrong");
            document.getElementById("password_current").value = "";
            validity = false;
        }
        updateColor();
        if(validity)
            deleteAccount();
        else
            alert("Please check inputs again");
    }).catch((error)=>{
        console.error("Error checking password on DB");
        console.error(error);
    });
}

function sendProfile(){
    var fmd = new FormData(document.forms.profileform);
    fmd.append('userId', currentUser.userId);
    fetch("/profile/settings/save",{
        method: "PATCH",
        body: fmd,
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            window.location.href = '/profile'; //TODO
        } else {// ERROR
            ////console.log(res.statusText);
            ////console.log("response error: " + res.status);
            alert("Error saving your profile, please try again.");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function saveProfile(){
    var form = new FormData(document.forms.profileform);
    validCurrentPassword = false;
    validity = true;
    for(var f of form){ 
        if(f[1].length == 0){
            if(f[0] != "mname" && f[0] != "bio" && f[0] != "profilepic-select" && f[0] != "password_a" && f[0] != "password_b"){
                errMessage("validateSignupInputs",  f[0] + " not filled");
                validity = false;
            }
        }
        //CHECK EMAIL IF IT IS AN EMAIL
        if(f[0] == "email"){
            if(!validator.isEmail(f[1])){
                errMessage("validateSignupInputs", "Invalid email");
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
    var body = {};
    body['username'] = currentUser.username;
    body['password'] = String(document.getElementById('password_current').value);
    fetch("/validate/password",{
        method:'POST',
        body: JSON.stringify(body),
        headers:{ "Content-Type": "application/json"}        
    }).then((res)=>{
        //console.log('res.json()');
        return res.json();
    }).then(data=>{
        //console.log("match: " + data['match']);
        validCurrentPassword = data['match'];
    }).finally(()=>{
        //console.log('finally: '+ validCurrentPassword);
        var a = document.getElementById("password_a").value;
        var b = document.getElementById("password_b").value;
        if(validCurrentPassword){
            if(a.length > 0 && b.length > 0){
                if(String(a)===(String(b))){
                    newPassMismatch = false;
                    validity = true;
                }else{
                    //console.log("new pass mismatch");
                    newPassMismatch = true;
                    validity = false;
                }
            }else{
                //console.log("no new password");
                validity = true;
            }
        }else{
            //console.log("current password wrong");
            document.getElementById("password_current").value = "";
            validity = false;
        }
        updateColor();
        if(validity)
            sendProfile();
        else
            alert("Please check inputs again");
    }).catch((error)=>{
        console.error("Error checking password on DB");
        console.error(error);
    });
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
        case "lname":
            errorMessage = "* Enter your last name";
            break;
        case "gender":
            errorMessage = "* Select a gender";
            break;
        case "bio":
            errorMessage = "* Enter a bio";
            break;
        case "password_a":
            errorMessage = "*Check if this matches the second password";
            break;
        case "password_b":
            errorMessage = "*Check if this matches the first password";
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
    //console.log(functionName + "(): ", msg);
}

/**
 * Carried over from HO3 trigges a scan of the form specified (unfortunately, it is hardcoded)
 */
 function updateColor(){
    var newPasswordA = false; //TO BE USED IF TO FLAG PASSWORD_B
    for(var f of new FormData(document.forms.profileform)){
        if(f[0] == "password_a" && f[1].length > 0) //NEW PASSWORD_A WAS SET
            newPasswordA = true;
        if(!(f[0]=="mname" || f[0]=="bio" || f[0]=="profilepic-select" || f[0]=="password_a")){
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
        if(f[0]=="password_current" && !f[1]){
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