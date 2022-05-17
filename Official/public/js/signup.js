console.log("signup.js loaded!");

var submitClicked = false;

 $(document).ready(()=>{
    $("#bio-counter").text("0/255"); //default max value for bio characters

    $("#signup-btn").click((e)=>{
        e.preventDefault();
        
        submitClicked = true;
        p = null // User object
        
        updateColor();
        if(validateSignupInputs()){
            p = createUser();
            console.log("New User Object: ");
            console.log(p);
            window.location.href = "/home";
        }
    });
    $("#login-btn").click(()=>{
        window.location.href = "/login";
    });
    $("#clear-btn").click(()=>{
        clearSignup();
    });
    $("#bio").keyup(()=>{
        updateTextCount();
    });
    $("#bio").keydown(()=>{
        updateTextCount();
    });
    $("#profilepic-select").on("change", ()=>{
        console.log("image change");
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
    $("#signup-btn").keyup((e)=>{
        updateColor();
    });
});


/*
===================================================================================

FUNCTION SPECIFIC METHODS

===================================================================================
*/

/**
 * Refreshes displayed User picture if file is selected; Uses tempURL/blobURL as placeholder for file
 */
function refreshDP(){
    var file = getInputFile("profilepic-select");
    if(file){ //check if it exists
        $("#profilepic").attr("src",getTempURL(file));
        $("#error-profilepic-select").text("");
    }
    else{
        $("#profilepic").attr("src","../img/default/default_dp.png");
        errMessage("refreshDP", "Error with file");
    }
        
}

/**
 * Creates User object based on inputs.
 * Call this only after validating if inputs are valid.
 * @returns User object with the inputs inputted by the user.
 */
function createUser(){
    let username = document.getElementById("username").value;
    let password = hash(document.getElementById("password_b").value); //RECOMMENDED TO BE IN HASH
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
 * Retrieves inputted signup data from signupform.
 * @returns Key-Value pair of all IDs available from @var idlist;
 */
function validateSignupInputs(){
    var form = new FormData(document.forms.signupform);
    var validity = true;
    var prevHash = "";
    for(f of form){
        if(f[1].length == 0){
            if(f[0] != "bio" && f[0] != "profilepic-select"){
                errMessage("validateSignupInputs",  f[0] + " not filled")
                validity = false;
            }
        }else{
            //CHECK EMAIL IF IT CONTAINS AT LEAST AN @
            if(f[0] == "email"){
                if(!f[1].includes("@")){
                    errMessage("validateSignupInputs", "Invalid email");
                    $("#error-" + f[0]).text("* Invalid email address");
                    changeBGColor(f[0], "var(--warning-light)");
                    validity = false;
                }
            } 
            
            //CHECK PASSWORD IF SAME, RECOMMENDED TO BE HASHED BEFORE COMPARING
            if(f[0] == "password_a"){
                prevHash = hash(f[1]);
            }
            if(f[0] == "password_b"){
                if(prevHash != hash(f[1])){
                    errMessage("validateSignupInputs", "Mismatched passwords");
                    $("#error-" + f[0]).text("* Passwords do not match");
                    changeBGColor(f[0], "var(--warning-light)");
                    validity = false;
                }
            }
            
            if(f[0] == "profilepic-select"){
                if(getInputFile("profilepic-select") == null){
                    errMessage("validateSignupInputs", "No Profile Picture Set");
                    $("#error-" + f[0]).text("* No Profile Picture set");
                    validity = false;
                }
            }
        }   
    }
    return validity;
}

/**
 * Clears the values of all inputs listed from idlist.
 * @param ids (Optional) you can specify the list ids to be cleared, uses idlist by default.
 * @returns 0 as basic confirmation.
 */
function clearSignup(){
    var form = new FormData(document.forms.signupform);
    for(f of form){
        $("#" + f[0]).val("");
        ($("#error-" + f[0])).text("");
        if(f[0] == "profilepic-select"){
            changeBGColor(f[0], "var(--primary)");
        }
        else if(f[0] == "gender"){
            changeBGColor(f[0], "var(--primary-button)");
        }
        else{
            changeBGColor(f[0], "var(--textbox)");
        }
    }
    refreshDP();

    submitClicked = false;
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
        case "password_a":
            errorMessage = "* Enter a password";
            break;
        case "password_b":
            errorMessage = "* Confirm your password";
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
    return URL.createObjectURL(file);
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
    for(f of new FormData(document.forms.signupform)){
        if(!(f[0]=="profilepic-select")){
            if(f[1] == ""){
                changeBGColor(f[0], "var(--warning-light)");
                setDefaultErrorMessage(f[0]);
            }
            else{
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
 */
 const User = function(username, password="", email, fname, mname, lname, gender, bio="", profilepic=""){
    this.username = username;
    this.password = password;
    this.email = email;
    this.fname = fname;
    this.mname = mname;
    this.lname = lname;
    this.gender = gender;
    this.bio = bio;
    this.profilepic = profilepic; //TO BE UPDATED TO POINT TO SERVER DIRECTORY AT '../img/dp/<username>.jpg'; BY CURRENT DESIGN, IF USERNAME WAS CHANGED, THE DP WILL BE SAVED AGAIN AS NEW FILE WITH NEW FILENAME (I.E. USERNAME)
    this.formal_name = lname + ", " + fname + " " + mname.substring(0,1);

    //IF A CLASS, ADD FUNCTION TO SAVE URL/BLOB AS FILE TO SERVER AT '../img/dp/<username>.jpg'
}