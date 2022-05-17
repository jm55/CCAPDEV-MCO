console.log("settings.js loaded!");

/*
===================================================================================

OBJECTS

===================================================================================
*/


/**
 * User Profile or User Object
 * @param {string} username Username
 * @param {string} password Password (Refers to password_b at signup and settings)
 * @param {string} email Email
 * @param {string} fname First Name
 * @param {string} mname Middle Name
 * @param {string} lname Last Name
 * @param {string} gender Gender
 * @param {string} bio Biography
 * @param {string} profilepic ProfilePic (string? or blob? NOT YET SURE)
 * @param {Date} dateCreated Used as reference values for hashing userID. Defaults to new Date() but can be set as constant when prototyping users.
 * @param {string} userID Identifier for user, leave as null by default if a new account.
 */
 const User = function(username, password="", email, fname, mname="", lname, gender, bio="", profilepic="", dateCreated=new Date(), userID=null){
    this.username = username;
    this.password = password; //acts more as a passhash than a password
    this.email = email;
    this.fname = fname;
    this.mname = mname;
    this.lname = lname;
    this.gender = gender;
    this.bio = bio;
    this.profilepic = profilepic; //TO BE UPDATED TO POINT TO SERVER DIRECTORY AT '../img/dp/<username>.jpg'; BY CURRENT DESIGN, IF USERNAME WAS CHANGED, THE DP WILL BE SAVED AGAIN AS NEW FILE WITH NEW FILENAME (I.E. USERNAME)
    this.formal_name = lname + ", " + fname + " " + mname.substring(0,1);
    if(userID == null)
        this.userID = hash(this.username+dateCreated.toString); //hash() must be on the same area as User constructor; DON'T IMPLEMENT FOR PHASE 1 JUST YET
    else
        this.userID = userID;
    //IF A CLASS, ADD FUNCTION TO SAVE URL/BLOB AS FILE TO SERVER AT '../img/dp/<username>.jpg'
}


/*
===================================================================================

FOR DEMONSTRATION PURPOSES
SAMPLE SCRIPTED DATA

===================================================================================
*/
var currentUser = null; // = new User();


/* MAIN */
var submitClicked = false;
 $(document).ready(()=>{
    $("#bio-counter").text("0/255"); //default max value for bio characters

    currentUser = new User("dlsu","237392540","dlsu@mail.com","De La Salle", "University", "Manila", "M", "Animo La Salle", "../img/dp/dlsu_dp.webp"); //SAMPLE LOGGED IN USER
    loadUser(currentUser);
    displayCurrentUser();

    $("#save-btn").click((e)=>{
        e.preventDefault();
        if(validateProfileInputs()){
            updatedUser = saveProfile(currentUser);
            if(updatedUser){
                currentUser = updatedUser;
                updatedUser = null;
            }
        }   
        updateColor();  
    });
    $("#cancel-btn").click(()=>{
        window.location.href = "/home";
    });
    $("#delete-btn").click(()=>{
        if(confirm("Do you want to close the account?")){
            if(hash(document.getElementById("password_current").value)==currentUser.password){
                console.log("Close account: " + currentUser);
                //ROUTE TO index
                window.location.href = "../index.html";
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
    $("select").on("change",(e)=>{
        if(submitClicked)
            updateColor();
    });
    $("#save-btn").keyup((e)=>{
        updateColor();
    });
});


/*
===================================================================================

FUNCTION SPECIFIC METHODS

===================================================================================
*/

function displayCurrentUser(){
    $("#profilepic").attr("src", currentUser.profilepic);
    //$("#userfullname").text(currentUser.formal_name);
    //$("#myaccount").attr("href", "../html/profile.html");
    //$("#logout-btn").attr("href","../html/login.html");
}

/**
 * @param {User} user User profile to be modified
 * @returns User object when saved to server, null if not saved
 */
function saveProfile(user){
    var updatedUser = null;

    user.username = document.getElementById("username").value;
    user.email = document.getElementById("email").value;
    user.fname = document.getElementById("fname").value;
    user.mname = document.getElementById("mname").value;
    user.lname = document.getElementById("lname").value;
    user.gender = document.getElementById("gender").value;
    user.bio = document.getElementById("bio").value;
    
    let URL = getTempURL(getInputFile("profilepic-select"));
    if(URL)
        user.profilepic = URL; //TEMPORARILY USING BLOBURL
    
    if(document.getElementById("password_b").value.length > 0)
        user.password = hash(document.getElementById("password_b").value); //RECOMMENDED TO BE IN HASH
    else
        user.password = hash(document.getElementById("password_current").value); //RECOMMENDED TO BE IN HASH
    
    if(true){
        updatedUser = user;
    }

    return updatedUser;
}


/**
 * TODO
 * Loads user to profile inputs
 * @param {User} user 
 */
function loadUser(user){
    if(user){
        $("#username").val(user.username);
        $("#email").val(user.email);
        $("#fname").val(user.fname);
        $("#mname").val(user.mname);
        $("#lname").val(user.lname);
        $("#gender").val(user.gender);
        $("#bio").val(user.bio);
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
 * Creates User object based on inputs.
 * Call this only after validating if inputs are valid.
 * @returns User object with the inputs inputted by the user.
 */
function createUser(){
    let username = document.getElementById("username").value;
    let password = hash(document.getElementById("password_b").value); //HASHED EQUIVALENT
    let email = document.getElementById("email").value;
    let fname = document.getElementById("fname").value;
    let mname = document.getElementById("mname").value;
    let lname = document.getElementById("lname").value;
    let gender = document.getElementById("gender").value;
    let bio = document.getElementById("bio").value;
    let profilepic = getTempURL(getInputFile("profilepic-select")); //TEMPORARILY USING BLOBURL

    return new User(username,password,email,fname, mname, lname, gender,bio, profilepic);
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
                errMessage("validateSignupInputs",  f[0] + " not filled")
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
            if(currentUser.password == hash(f[1])){
                validCurrentPassword = true;
            }
            else{
                validity = false;
                alert("incorrect currentPassword");
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