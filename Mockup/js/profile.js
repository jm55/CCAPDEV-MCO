console.log("profile.js");

/*
===================================================================================

OBJECTS

===================================================================================
*/
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

/**
 * Comment Object
 * @param {User} user User that posted the comment
 * @param {string} comment_text Content of comment
 * @param {string} posthash Post that it is attached to 
 * @param {Date} datetime Date and time of the comment posted
 */
 const Comment = function(user, comment_text, posthash, datetime=new Date()){
    this.user = user; //userID
    this.comment_text = comment_text;
    this.posthash = posthash;
    this.datetime = datetime;
}


/*
===================================================================================

FOR DEMONSTRATION PURPOSES
SAMPLE SCRIPTED DATA

===================================================================================
*/
var users = [] //TEMPORARY SINCE EACH COMMENT REQUIRES A USER OBJECT WHICH SHOULDN'T BE THE CASE; SHOULD'VE BEEN AN USERID
var posts = []; //Posts that are owned by currentUser;
var comments = [];
var currentUser = null;
var testComment = null;

function autoFill(){
    console.log("autoFill()");
    currentUser = new User("dlsu","237392540","dlsu@mail.com","De La Salle", "University", "Manila", "M", "Animo La Salle", "../img/dp/dlsu_dp.webp"); //SAMPLE LOGGED IN USER

    //ALL USERS ARE DONE BY BACKEND PROCESSING
    var user0 = new User("dlsu","237392540","dlsu@mail.com","De La Salle", "University", "Manila", "M", "Animo La Salle", "../img/dp/dlsu_dp.webp"); //SAMPLE LOGGED IN USER
    var user1 = new User("dijkstra_boro", hash("dijkstra_boro"), "dijkstra.boro@mail.com", "Boro","Vitek","Dijkstra","M","Food specialist. Music junkie. Reader. Professional tv fanatic. Introvert. Coffee aficionado. Bacon fan. Web advocate.","../img/dp/dijkstra_boro.webp");
    var user2 = new User("skinner_thomas",hash("skinner_thomas"),"skinner.thomas@mail.com","Thomas","Dwain","Skinner","M","Pop culture ninja. Coffee enthusiast. Evil introvert. Social media scholar. Unapologetic internet geek. Tv fan.","../img/dp/skinner_thomas.webp");
    var user3 = new User("morita_haruka",hash("morita_haruka"),"morita.haruka@mail.com","Haruka","Yuzuki","Morita","F","Incurable bacon fan. Food nerd. Award-winning social media expert. Certified zombie maven. Friendly travel geek.","../img/dp/morita_haruka.webp");
    var user4 = new User("bogomolov_natalya",hash("bogomolov_natalya"),"bogomolov.natalya@mail.com","Natalya","Yulia","Bogomolov","F","Tv expert. Extreme reader. Pop culture geek. Bacon guru. General explorer. Student. Organizer.","../img/dp/bogomolov_natalya.webp");
    users.push(user0, user1,user2,user3,user4);
    currentUser = users[0];
    
    //ALL POSTS COLLECTED ARE DONE BY BACKEND PROCESSING
    posts.push(new Post(users[0], "Get your latest Team DLSU Merch at SCHOOLSPIRIT from Shopee for just P450", "Men'sApparel", "shoolspirit on Shopee","https://shopee.ph/La-Salle-Team-DLSU-Shirt-(Unisex)-i.110479407.14750117688?sp_atk=368b0794-f747-4e2b-8edc-bd1475f1646b&xptdk=368b0794-f747-4e2b-8edc-bd1475f1646b", null, "../img/post_img/61619111.webp",1911,0,[],"61619111",new Date(2021,5,19)));
    posts.push(new Post(users[0], "Get your latest Green Stallions Merch at EpicClothingWear from Shopee for just P450", "Men'sApparel", "EpicClothingWear on Shopee","https://shopee.ph/DE-LA-SALLE-UNIVERSITY-SHIRT-i.58444376.1375379701", null, "../img/post_img/61619112.webp", 1911, 0, [], "61619112",new Date(2020,5,19)));

    //ALL COMMNENTS ARE DONE BY BACKEND PROCESSING
    comments.push(new Comment(users[1], "I'd like to buy 1", "61619112",new Date()));
    comments.push(new Comment(users[2], "Take my moneyyyy", "61619111",new Date()));
    comments.push(new Comment(users[3], "Ahhhhhh", "61619111",new Date()));
    comments.push(new Comment(users[4], "DLSU Animo Lasalle", "61619111",new Date()));
    comments.push(new Comment(users[1], "Animo Lasalle", "61619112",new Date()));
    comments.push(new Comment(users[2], "WHOOOOOOO Finally!!!!", "61619112",new Date()));
    comments.push(new Comment(users[2], "Time to beat the summer heat for my kids!", "74547",new Date()));
}

/* MAIN */
$(document).ready(()=>{
    autoFill();
    console.log("currentUser");
    console.log(currentUser);
    displayCurrentUser();

    displayPosts(posts, comments);

    $("#search-btn").click((e)=>{
        e.preventDefault();
        var filteredPosts = filterBySearch(posts,getSearch());
        sortByDate(filteredPosts);
        resetTimeline();
        displayPosts(filteredPosts,comments);
    });

    $("#search-txt").keyup((e)=>{
        e.preventDefault();
        if(e.key=="Enter"){
            var filteredPosts = filterBySearch(posts,getSearch());
            sortByDate(filteredPosts);
            resetTimeline();
            displayPosts(filteredPosts);
        }
    });

    $("#categories").on("change", (e)=>{
        var filteredPosts = filterByCategory(posts, $("#categories").val());
        sortByDate(filteredPosts);
        resetTimeline();
        displayPosts(filteredPosts, comments);
    });

});

/*
===================================================================================

FUNCTION SPECIFIC METHODS

===================================================================================
*/

/**
 * Sorts the given list of posts by date 
 * @param {list} postList Post list to be sorted
 * @param {Boolean} descending Sorts the given postList on a descending order by default (true), set as false if otherwise.
 * @returns Sorted post list by date whether descending or ascending.
 */ 
 function sortByDate(postList, descending=true){
    var sortedPosts = [];
    if(descending){
        sortedPosts = postList.sort((a, b) => (a.datetime < b.datetime) ? 1 : (a.datetime === b.datetime) ? ((a.datetime < b.datetime) ? 1 : -1) : -1 );        
    }else{
        sortedPosts = postList.sort((a, b) => (a.datetime > b.datetime) ? 1 : (a.datetime === b.datetime) ? ((a.datetime > b.datetime) ? 1 : -1) : -1 );
    }
    return sortedPosts;
}

/**
 * Filters posts by list of keywords on search
 * @param {list} postList List of posts to be filtered
 * @param {string} category Target category for filtering
 * @returns Filtered Posts by Search value
 */
 function filterByCategory(postList, category){
    var filteredPosts = [];
    for(p of postList){
        if(p.category.toLowerCase().includes(category.toLowerCase()))
            filteredPosts.unshift(p);
    }
   return filteredPosts;
}

function displayCurrentUser(){
    $("#profile-pic").attr("src", currentUser.profilepic);
    document.title = currentUser.username + " - Budol Finds";
    //$("#userfullname").text(currentUser.formal_name);
    //$("#myaccount").attr("href", "../html/profile.html");
    //$("#logout-btn").attr("href","../html/login.html");
}

/**
 * Filters posts by list of keywords on search
 * @param {list} searchList Keywords used for filtering posts
 * @returns Filtered Posts by Search value
 */
 function filterBySearch(postList, searchList){
    var filteredPosts = [];
    for(p of postList){
        for(s of searchList){
            if(p.description.toLowerCase().includes(s.toLowerCase())){
                filteredPosts.unshift(p);
            }
        }
    }
   return filteredPosts;
}

/**
 * Retrieves the list of keyword from search box (#search-txt)
 * @returns List of keywords found on #search-txt (split by ' ')
 */
 function getSearch(){
    var searchVal = $("#search-txt").val();
    return searchVal.split(" ");
}

/**
 * The order or manner to which the posts are displayed is dependent on the 
 * sorting or filtering done on the postList given on the parameter.
 * @param {list} postList Contains all list of posts that will be used.
 * @param {list} commentList Contains all comments for posts in postList
 */
 function displayPosts(postList, commentList){
    console.log("displayPosts");
    for(p of postList){
        var filteredComments = getCommentsToPost(p, commentList);
        $(".timeline").append(buildPostCard(p, filteredComments));
    }
}

/**
 * Adds a single post to the timeline.
 * @param {Post} singlePost 
 * @param {list} postComments 
 */
function displayPost(singlePost, postComments){
    $(".timeline").append(buildPostCard(singlePost, postComments));
}

/**
 * Removes all contents of timeline
 */
function resetTimeline(){
    $(".timeline").empty();
}

/**
 * Build a single 'post card' element
 * @param {Post} singlePost 
 * @param {list} postComments 
 * @returns div object class="post card" with child post objects
 */
 function buildPostCard(singlePost, postComments){
    //Prepare footer elements
    var footer = buildPostFooter(singlePost);
    var footer_comments = buildPostComments(singlePost,postComments);
    $(footer).append(footer_comments);

    //Creating elements
    var post_card = document.createElement("div");
        var post_header = document.createElement("div");
            var post_user = document.createElement("span");
                var postdp = document.createElement("img");
                var username = document.createElement("a");
        var post_content = document.createElement("div");
            var post_description = document.createElement("div");
                var post_description_text = document.createElement("p");
        var post_list = document.createElement("div");
            var post_table = document.createElement("table");
                var tr0 = document.createElement("tr");
                    var item_label = document.createElement("td");
                    var item_link = document.createElement("td");
                        var item_link_a = document.createElement("a");
                var tr1 = document.createElement("tr");
                    var category = document.createElement("td");
                    var category_link = document.createElement("td");
                        var category_link_a = document.createElement("a");
        var post_image_div = document.createElement("div");
            var post_image = document.createElement("img");
        //Footer
    {
        //Adding classes
        $(post_card).addClass("post");
        $(post_card).addClass("card");
        $(post_header).addClass("post_header");
        $(post_user).addClass("post_user");
        $(postdp).addClass("postdp");
        $(postdp).addClass("profilepic");
        $(username).addClass("username");
        $(post_content).addClass("post_content");
        $(post_description).addClass("post_description");
        $(post_description_text).addClass("post_description_text");
        $(post_list).addClass("post_list");
        $(post_table).addClass("post_table");
        $(item_label).addClass("item_label");
        $(item_link).addClass("item_link");
        $(category_link).addClass("item_category_link");
        $(post_image_div).addClass("post_image_div");
        $(post_image).addClass("post_image");

        //Adding hrefs
        $(username).attr("href",""); //user link of singlePost.user
        $(category_link_a).attr("href",""); //link to category

        //Adding inner text
        $(username).text(singlePost.user.username);
        $(post_description_text).text(singlePost.description);
        $(item_label).text(singlePost.label);
        $(item_link).text(singlePost.link);
        $(category).text("Category: ");
        $(category_link_a).text(singlePost.category);

        //Adding image srcs
        $(post_image).attr("src", singlePost.imgurl);
        $(postdp).attr("src", singlePost.user.profilepic);

        //Add other attributes
        $(postdp).attr("alt","Profile Picture");
        //$(post_image).attr("loading", "lazy");

        //APPENDING
        //Header
        $(post_user).append(postdp);
        $(post_user).append(username);
        $(post_header).append(post_user); //Complete
        //Content: post_description
        $(post_description).append(post_description_text); //Complete
        //Content: post_list
        $(item_link).append(item_link_a);
        $(tr0).append(item_label);
        $(tr0).append(item_link);
        $(category_link).append(category_link_a);
        $(tr1).append(category);
        $(tr1).append(category_link);
        $(post_table).append(tr0);
        $(post_table).append(tr1); //Complete
        //Content: post_image_div
        $(post_image_div).append(post_image); //Complete
        //Content: post_content
        $(post_content).append(post_header);
        $(post_content).append(post_description);
        $(post_content).append(post_table);
        $(post_content).append(post_image_div);
        
        $(post_card).append(post_content);
        $(post_card).append(footer);

    }
    
    return post_card;
}

/**
 * Builds the upper portion of the post_footer including the post_footer itself.
 * @param {Post} post Post object that will be used to build the post_footer.
 * @returns Footer element that will be used by a postCard element.
 */
 function buildPostFooter(singlePost){
    //DIVs
    var post_footer = document.createElement("div");
    var likes_div = document.createElement("div");
    var interact = document.createElement("form");
    //Ps
    var likecounter = document.createElement("p");
    var post_timedate = document.createElement("p");
    //INTERACTs
    var likeBtn = document.createElement("button");
    var shareBtn = document.createElement("button");
    var reportBtn = document.createElement("button");
    var comment = document.createElement("input");
    var submit = document.createElement("button");

    {
        //Setting className();
        $(post_footer).addClass("post_footer");
        $(likes_div).addClass("likes")
        $(interact).addClass("interact");
        $(likecounter).addClass("likecounter");
        $(post_timedate).addClass("post_timedate");
        $(likeBtn).addClass("button");
        $(shareBtn).addClass("button");
        $(reportBtn).addClass("button");
        $(comment).addClass("textfield");
        $(comment).addClass("comment_textfield");
        $(submit).addClass("button");
        
        //Adding IDs&names
        //IDs
        $(interact).attr("id","interact#" + singlePost.posthash);
        $(likeBtn).attr("id","like-button#" + singlePost.posthash);
        $(shareBtn).attr("id","share-button#" + singlePost.posthash);
        $(reportBtn).attr("id","report-button#" + singlePost.posthash);
        $(comment).attr("id","comment#" + singlePost.posthash);
        $(submit).attr("id","submit-comment#" + singlePost.posthash);
        //names
        $(interact).attr("name","interact#" + singlePost.posthash);
        $(likeBtn).attr("name","likeBtn#" + singlePost.posthash);
        $(shareBtn).attr("name","shareBtn#" + singlePost.posthash);
        $(reportBtn).attr("name","reportBtn#" + singlePost.posthash);
        $(comment).attr("name","comment#" + singlePost.posthash);
        $(submit).attr("name","submitComment#" + singlePost.posthash);

        //Adding innerHTML
        $(likecounter).text(singlePost.like + " likes");
        $(post_timedate).text("Posted: " + singlePost.datetime.toDateString());
        $(likeBtn).text("Like");
        $(shareBtn).text("Share");
        $(reportBtn).text("Report");
        $(submit).text("Comment");

        //APPENDING
        $(likes_div).append(likecounter);
        $(likes_div).append(post_timedate);
        $(interact).append(likeBtn);
        $(interact).append(shareBtn);
        $(interact).append(reportBtn);
        $(interact).append(comment);
        $(interact).append(submit);
        $(post_footer).append(likes_div);
        $(post_footer).append(interact);
    }
    
    // EVENTLISTENERS FOR FOOTER BUTTONS
    likeBtn.addEventListener("click", function(e){
        e.preventDefault();

        //Get post index to post
        var thisIndex = -1;
        thisIndex = searchPostIndex(posts, singlePost.posthash);

        var like_val = parseInt(posts[thisIndex].like);
        //Check state of like button
        if(likeBtn.innerHTML == "Like"){ //Increment Like and set state as Liked
            //Get & set like value of post
            like_val++;
            likeBtn.innerHTML = "Liked";
            
        }else{ //Decrement Like and set state as Like
            like_val--;
            likeBtn.innerHTML = "Like";
        }

        //Update like display
        posts[thisIndex].like = like_val; //UPDATE ACTUAL OBJECT IN LIST
        likecounter.innerHTML = parseInt(posts[thisIndex].like) + " likes";
    });

    shareBtn.addEventListener("click", function(e){
        e.preventDefault();
        console.log("shareBtn Clicked @ " + singlePost.posthash);
        alert("Temporary\nPastes a URL to clipboard that links to post.\nPost Hash: " + singlePost.posthash);
    });

    reportBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        console.log("reportBtn Clicked @ " + singlePost.posthash);
        alert("Temporary\nReport Object will be created as supposed to earlier data design considerations of just counting the reports done on the post.\nPost Hash: " + singlePost.posthash);
    });

    submit.addEventListener("click", (e)=>{
        e.preventDefault();
        var comment_val = $(comment).val();
        var commentObj = new Comment(currentUser, comment_val, singlePost.posthash, new Date());
        console.log("submit(Comment) Clicked @ " + singlePost.posthash + " contains: ");
        console.log(commentObj);

        /**
         * TODO: 
         * 1. Add commentObj to comments[]
         * 2. Display to comment_list of this post
         */
    }); 

    return post_footer;
}

/**
 * Build the entire comment_list element for use by buildPostFooter();
 * @param {Post} post
 * @param {list} postComments 
 * @returns div object class="comment_list" with child comment objects 
 */
function buildPostComments(post, postComments){
    var comment_list = document.createElement("div"); //HOLDS ALL COMMENTS
    $(comment_list).addClass("comment_list");

    //Iterate through all postComments and append to comment_list
    for(p of postComments)
        $(comment_list).append(buildPostComment(post, p)); //uses buildPostComment() for each comments

    return comment_list;
}

/**
 * Builds a single post comment element
 * @param {string} postHash 
 * @param {Comment} postComment 
 * @returns A comment element that contains the comment specified on the parameters
 */
function buildPostComment(post, postComment){
    var comment_div = document.createElement("div");
    var commenter = document.createElement("a");
    var comment = document.createElement("p");
    var comment_date = document.createElement("p");

    //Assign classes
    $(comment_div).addClass("comment_div");
    $(commenter).addClass("username");
    $(comment_date).addClass("comment_date");

    //Href for username
    $(commenter).attr("href",""); //TO BE UPDATED WITH THE USER LINK

    //Add innerHTML
    $(commenter).text(postComment.user.username);
    $(comment).text(postComment.comment_text);
    $(comment_date).text(postComment.datetime.toDateString());

    //Appending
    $(comment_div).append(commenter);
    $(comment_div).append(comment);
    $(comment_div).append(comment_date);

    return comment_div;
}

/**
 * Gets comments from comments[] that match the given posthash.
 * @param {Post} post Post reference for finding comments related to it.
 * @param {list} commentList List of comments to sift through.
 * @returns List of filtered comments specified by post.
 */
 function getCommentsToPost(post, commentList){
    var postHash = post.posthash; //CAN BE SWITCHED TO 
    var filteredComments = [];
    if(typeof(commentList) != "undefined") //NOT THE BEST FIX BUT IT'LL WORK
        for(c of commentList){
            if(c.posthash ==  postHash)
                filteredComments.push(c);
        }
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