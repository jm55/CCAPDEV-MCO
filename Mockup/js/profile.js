console.log("profile.js");

/*
===================================================================================

OBJECTS

===================================================================================
*/
/**
 * Post Object
 * @param {User} user Username of the postee
 * @param {string} description Description of the Post
 * @param {string} category Category of Post Item
 * @param {string} label Label of product in post item
 * @param {string} link Link of product in post item
 * @param {*} imgblob Image in blob type
 * @param {string} imgurl Image in URLtype
 * @param {Number} like Number of likes; Default: 0
 * @param {Number} report Report count
 * @param {list} comment Comment objects
 * @param {string} posthash Post hash (identifier for post)
 * @param {string} postid  Post ID
 * @param {Date} datetime Date and Time of Post; Default: new Date()
 */
 const Post = function(user, description="", 
                        category="", label="", link="", imgblob=null, imgurl="", 
                        like=0, report=0, comment=[], 
                        posthash="", postid=-1, datetime = new Date()){
    this.user = user;
    this.description = description;
    this.category = category;
    this.imgblob = imgblob;
    this.imgurl = imgurl;
    this.like = like;
    this.report = report;
    this.comment = comment;
    this.posthash = posthash;
    this.postid = postid;
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
 */
 const User = function(username, password="", email, fname, mname="", lname, gender, bio="", profilepic=""){
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

/**
 * Comment Object
 * @param {User} user User that posted the comment
 * @param {string} comment_text Content of comment
 * @param {string} posthash Post that it is attached to 
 * @param {Date} timedate Date and time of the comment posted
 */
 const Comment = function(user, comment_text, posthash, timedate=new Date()){
    this.user = user;
    this.comment_text = comment_text;
    this.posthash = posthash;
    this.datetime = timedate;
}

/*
===================================================================================

FOR DEMONSTRATION PURPOSES
SAMPLE SCRIPTED DATA

===================================================================================
*/

var posts = []; //Posts that are owned by currentUser;
var comments = [];
var currentUser = null;
var testComment = null;

/**
 * TODO
 */
 function autoFill(){ 
    //FOR ALL TODOs, GO TO FOLDER 'sample_data' FOR ALL CSVs THAT YOU CAN USE EXCEL WITH FOR A MUCH EASIER BUILDING, BUT REMEMBER TO ADD "" IF OBJECTS ARE TYPEOF STRINGS

    //TODO: Build at least 2 posts per user and push each to posts[] (via Post())
    //Parameters (and its defaults) are as follows: user, description="", category="", label="", link="", imgblob=null, imgurl="", like=0, report=0, comment=[], posthash="", postid=-1, datetime = new Date()
    //Set imgblob as null for now
    //For posthash, use hash(string). Example shown below. Hopefully, no hash-collision will occur.
    //Set your own post datetime as: new Date(year, month, day, hour, minute). 
    //Image Directory & Filename: "../img/post/<username>_<posthash>_product.jpg"
    let samplehash = hash("username" + "description" + "datetime");

    //TODO: Build comment list at any amount you'd like and push each to comments[] (via Comment())
    //Parameters: user, comment_text, posthash, timedate=new Date()
    //Make sure that posthash can be found on at least a post of posts[].
    for(c of comments) //You may delete this once you've verified matching hashes.
        console.log(c);

    displayPosts(posts); //Hopefully by this call, users[], posts[], and comments[] are already filled.
}

/* MAIN */
$(document).ready(()=>{
    currentUser = new User("dlsu","237392540","dlsu@mail.com","De La Salle", "University", "Manila", "M", "Animo La Salle", "../img/dp/dlsu_dp.webp"); //SAMPLE LOGGED IN USER
    console.log("currentUser");
    console.log(currentUser);
    $("#profile-pic").attr("src", currentUser.profilepic);


    $("#search-btn").click((e)=>{
        e.preventDefault();
        filterBySearch(getSearch());
    });

    $("#search-txt").keyup((e)=>{
        e.preventDefault();
        if(e.key=="Enter")
            filterBySearch(getSearch());
    });

    $("#categories").on("change", (e)=>{
        console.log("Category Filter Changed: " + $("#categories").val());
        /**
         * TODO: Do filterByCategory();
         * Similar principle as getSearch() and filterBySearch(); hopefully.
         */ 
    });

});

/*
===================================================================================

FUNCTION SPECIFIC METHODS

===================================================================================
*/

/**
 * Filters posts by list of keywords on search
 * @param {list} searchList Keywords used for filtering posts
 * @returns Filtered Posts by Search value
 */
 function filterBySearch(searchList){
    var filteredPosts = [];
    /**
     * TODO: Implement filter for searching
     * posts with keywords listed on searchList;
     * 
     * Iterate on every post and check if post.description.contains(s[i]) where
     * s is every keyword on searchList[].
     * 
     * If it contains a listed keyword, append to filteredPosts[]
     * 
    */
   return filteredPosts;
}

/**
 * Retrieves the list of keyword from search box (#search-txt)
 * @returns List of keywords found on #search-txt (split by ' ')
 */
function getSearch(){
    var searchVal = $("#search-txt").val();
    console.log(searchVal.split(" "));
    return searchVal.split(" ");
}

/**
 * TODO
 * Iteratively posts specified in postList
 * Both parameter objects must be 'linked' or 'matching' each other.
 * @param {list} postList Contains all list of posts that will be used
 * @param {list} commentList Contains all comments for posts in postList
 */
function displayPosts(postList){
    for(p of postList){
        var filteredComments = getCommentToPost(p);
        displayPost(p, filteredComments);
    }
}

/**
 * Display a single post
 * @param {Post} singlePost 
 * @param {list} postComments 
 */
function displayPost(singlePost, postComments){
    /**
     * TODO: Build a 'post card' object. Use buildPostCard(singlePost, postComments);
     * Append built 'post card' object to div class timeline
     */
}

/**
 * Build a single 'post card' element
 * @param {Post} singlePost 
 * @param {list} postComments 
 * @returns div object class="post card" with child post objects
 */
function buildPostCard(singlePost, postComments){
    /**
     * Refer to CCAPDEV-MCO\Mockup\html\test\single_post_block.html for layout of postcard
     * 
     * Target to make is contents of div class="post card"
     * For object/node of div class comment_list call buildPostComments(postComments)
     * 
     * Reminder: For every element, use '<classname>+posthash' as the element's id for easier element tracking/identification
     */
    return null;
}
/**
 * Build the entire comment list object for use by buildPostCard();
 * @param {list} postComments 
 * @returns div object class="comment_list" with child comment objects 
 */
function buildPostComments(postComments){
    var comment_list = document.createElement("div");
    /**
     * Refer to CCAPDEV-MCO\Mockup\html\test\single_post_block.html for layout of postcard
     * 
     * Reminder: For every element, use '<classname>+posthash' as the element's id for easier element tracking/identification
     */
    return null;
}

/**
 * TODO
 * Gets comments from comments[] that match the given posthash.
 * @param {post} post Post reference for finding comments related to it.
 * @returns List of filtered comments specified by post.
 */
 function getCommentToPost(post){
    var postHash = post.posthash; //cAN BE SWITCHED TO 
    var filteredComments = [];
    /**
     * TODO: Iterate through comments[] and push all matching comments to
     * filteredComments[] using the posthash given. 
     */
    return filteredComments;
}

/*
===================================================================================

TRANSFERRABLE/GLOBAL METHODS

===================================================================================
*/

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