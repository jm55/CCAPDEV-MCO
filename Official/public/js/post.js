console.log("post.js");

/**
 * Post Object
 * @param {User} user Username of the postee //To be replaced with UserID in the future
 * @param {string} description Description of the Post
 * @param {string} posthash Post hash of the post
 * @param {string} category Category of Post Item
 * @param {string} label Label of product in post item
 * @param {string} link Link of product in post item
 * @param {*} imgblob Image in blob type //NULL 
 * @param {string} imgurl Image in URLtype
 * @param {Number} like Number of likes; Default: 0
 * @param {Number]} report Report count //TO BE REPLACED BY A Report object
 * @param {list} comment Comment objects
 * @param {Date} datetime Date and Time of Post; Default: new Date()
 */
 const Post = function(user, description="", 
                        category="", label="", link="", imgblob=null, imgurl="", 
                        like=0, report=0, comment=[], 
                        posthash="", datetime = new Date()){
    this.user = user; //to be replaced by userID
    this.description = description;
    this.posthash = posthash;
    this.category = category;
    this.imgblob = imgblob;
    this.imgurl = imgurl;
    this.like = like;
    this.report = report;
    this.comment = comment;
    this.datetime = datetime;
    this.label = label;
    this.link = link;
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

var currentUser = null;
var currentPost = null;

$(document).ready(()=>{
    autoFill();
    displayCurrentUser();

    fillInput(currentPost);

    $("#save-post-btn").click((e)=>{
        e.preventDefault();
        currentPost = savePost(currentPost);
        alert("TEMP\ncheck console for printout of post changes");
        console.log("save-post");
    });
    $("#delete-post-btn").click((e)=>{
        e.preventDefault();
        if(confirm("Delete this post?")){
            console.log("Post will be deleted");
            //Delete post here
        }else{
            //Route back to home
            window.location.href = "../html/home.html";
        }
        console.log("delete-post");
    });
    $("#cancel-post-btn").click((e)=>{
        e.preventDefault();
        //Route back to home
        window.location.href = "../html/home.html";
        console.log("cancel-edit-post");
    });
    $("#post-img-select").on("change",()=>{
        console.log("image change");
        refreshNewPostImage();
    });
});

/**
 * Merges inputs from the post form to the post param and returns it.
 * @param {Post} post Post to be modified (presumptively to be currentPost);
 * @returns Modified Post object.
 */
function savePost(post){
    console.log(post);
    
    var description = $("#post-content").val();
    var category = $("#post-category").val();
    var label = $("#post-label").val();
    var link = $("#post-link").val();
    var imgurl = getTempURL(getInputFile("post-img-select"));

    post.description = description;
    post.category = category;
    post.label = label;
    post.link = link;
    post.imgurl = imgurl;

    console.log(post);
    return post;
}

/**
 * Fills the inputs for post using values specified by post param.
 * @param {Post} post Post to be used for filling post form.
 */
function fillInput(post){
    var description = post.description
    var category = post.category;
    var imgurl = post.imgurl;
    var label = post.label;
    var link = post.link;

    $("#post-content").val(description);
    $("#post-category").val(category);
    $("#post-label").val(label);
    $("#post-link").val(link);
    $("#post-image").attr("src",imgurl);
    $("#post-image").attr("style","display:block;");
}

/**
 * Builds the currentUser and currentPost.
 */
function autoFill(){
    currentUser = new User("dlsu","237392540","dlsu@mail.com","De La Salle", "University", "Manila", "M", "Animo La Salle", "../img/dp/dlsu_dp.webp"); //SAMPLE LOGGED IN USER\
    currentPost = new Post(currentUser, "Get your latest Team DLSU Merch at SCHOOLSPIRIT from Shopee for just P450", "Men'sApparel", "shoolspirit on Shopee","https://shopee.ph/La-Salle-Team-DLSU-Shirt-(Unisex)-i.110479407.14750117688?sp_atk=368b0794-f747-4e2b-8edc-bd1475f1646b&xptdk=368b0794-f747-4e2b-8edc-bd1475f1646b", null, "../img/post_img/61619111.webp",1911,0,[],"61619111",new Date(2021,5,19));
}

/**
 * Displays the currentUser object to the page user identfier elements.
 */
function displayCurrentUser(){
    $("#profile-pic").attr("src", currentUser.profilepic);
    //document.title = currentUser.username + " - Budol Finds";
    //$("#userfullname").text(currentUser.formal_name);
    //$("#myaccount").attr("href", "../html/profile.html");
    //$("#logout-btn").attr("href","../html/login.html");
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