console.log("home.js loaded");

//FOR DEMONSTRATION PURPOSES
var users = buildUsers();
var posts = buildPosts();
var currentUser = null;
function autoFill(){
    currentUser = users[0];
}
function buildUsers(){
    /**
     * FILL EACH USER LIST WITH (IN ORDER):
     * username,password,email,fname,mname,lname,gender,bio,profilepic (@ 9 ITEMS)
     * Refer to './object_classes/user.js' for more details of how to build a User.
     * You may also use MS Excel and use '../sample_data/users.csv' as a guide for building User data.
     */
    u0 = [];
    u1 = [];
    u2 = [];
    u3 = [];
    u4 = [];

    var list = [];
    list.push(new User(u0[0],u0[1],u0[2],u0[3],u0[4],u0[5],u0[6],u0[7],u0[8]));
    list.push(new User(u1[0],u1[1],u1[2],u1[3],u1[4],u1[5],u1[6],u1[7],u1[8]));
    list.push(new User(u2[0],u2[1],u2[2],u2[3],u2[4],u2[5],u2[6],u2[7],u2[8]));
    list.push(new User(u3[0],u3[1],u3[2],u3[3],u3[4],u3[5],u3[6],u3[7],u3[8]));
    list.push(new User(u4[0],u4[1],u4[2],u4[3],u4[4],u4[5],u4[6],u4[7],u4[8]));

    return list;
}
function buildPosts(){
    return null;
}


$(document).ready(()=>{

    autoFill(); //FILLS WINDOW WITH DEMO CONTENT

    $("#new-post-btn").click((e)=>{
        if(validateNewPost()){
            console.log("VALID ENTRY");
        }else{
            console.log("!  VALID ENTRY");
        }
    });

    $("#new-post-img-select").on("change",()=>{
        console.log("new-post-img");
        refreshNewPostImage();
    });

    $("#new-post-cancel-btn").click((e)=>{
        //var forms = new
    });
});

/*
===================================================================================

FUNCTION SPECIFIC METHODS

===================================================================================
*/


function refreshNewPostImage(){
    var file = getInputFile("new-post-img-select");
    if(file){ //check if it exists
        document.getElementById("new-post-image").style.display = "block";
        $("#new-post-image").attr("src",getTempURL(file));
    }else{
        document.getElementById("new-post-image").style.display = "none";
        $("#new-post-image").attr("src",getTempURL(file));
        errMessage("refreshDP", "Error with file");
    }
}

function createPost(){
    let 
}

function validateNewPost(){
    var form = new FormData(document.forms.newPostForm);
    var validity = true;
    for(f of form){
        if(f[0] == "new-post-img-select")
            if(!getInputFile("new-post-img-select"))
                validity = false;
        else if(f[1].length == 0)
            validity = false;
    }
    return validity;
}



/*
===================================================================================

TRANSFERRABLE/GLOBAL METHODS

===================================================================================
*/

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
 * Prints err message on console
 * Use for silent invalid input messages
 * @param {string} functionName Name of function that called this. Don't include '()'
 * @param {string} msg Details of error
 */
 function errMessage(functionName, msg){
    console.log(functionName + "(): ", msg);
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


/*
===================================================================================

OBJECTS

===================================================================================
*/

/**
 * Post Object
 * @param {*} user User of the Post 
 * @param {*} description Description of the Post
 * @param {*} category Category of Post Item
 * @param {*} imgblob Image in blob type
 * @param {*} imgurl Image in URLtype
 * @param {*} like Number of likes; Default: 0
 * @param {*} report Report objects (Can be converted to report counts if needed)
 * @param {*} comment Comment objects
 * @param {*} posthash Post hash (identifier for post)
 * @param {*} postid  Post ID
 * @param {*} datetime Date and Time of Post; Default: new Date()
 */
 const Post = function(user, description="", 
 category="", imgblob=null, imgurl="", 
 like=0, report=[], comment=[], 
 posthash="", postid=-1, datetime = new Date()){
    this.user = user;
    this.description = description;
    this.category = category;
    this.imgblob = blob;
    this.imgurl = url;
    this.like = like;
    this.report = report;
    this.comment = comment;
    this.posthash = posthash;
    this.postid = postid;
    this.datetime = datetime;
}

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
    this.formal_name = lname + ", " + fname + " " + mname[0,1];

    //IF A CLASS, ADD FUNCTION TO SAVE URL/BLOB AS FILE TO SERVER AT '../img/dp/<username>.jpg'
}