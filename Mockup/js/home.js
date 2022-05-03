console.log("home.js loaded");
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
 * @param {Date} dateCreated TO ADD IN THE FUTURE; USED FOR CREATING USERID VIA HASH
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
    //TO ADD IN THE FUTURE => this.userID = hash(this.username+dateCreated.toString())

    //IF A CLASS, ADD FUNCTION TO SAVE URL/BLOB AS FILE TO SERVER AT '../img/dp/<username>.jpg'
}
/**
 * Comment Object
 * @param {User} user User that posted the comment
 * @param {string} comment_text Content of comment
 * @param {string} posthash Post that it is attached to 
 * @param {Date} timedate Date and time of the comment posted
 */
 const Comment = function(user, comment_text, posthash, datetime=new Date()){
    this.user = user;
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
var users = [];
var posts = [];
var comments = [];
var currentUser = null;

/**
 * TODO
 */
function autoFill(){
    console.log("autoFill()");
    var user0 = new User("dlsu","237392540","dlsu@mail.com","De La Salle", "University", "Manila", "M", "Animo La Salle", "../img/dp/dlsu_dp.webp"); //SAMPLE LOGGED IN USER
    users.push(user0);

    //FOR ALL TODOs, GO TO FOLDER 'sample_data' FOR ALL CSVs THAT YOU CAN USE EXCEL WITH FOR A MUCH EASIER BUILDING, BUT REMEMBER TO ADD "" IF OBJECTS ARE TYPEOF STRINGS

    //TODO: Build at least 3-5 users and push each to users[] (via User())
    //Parameters (and its defaults) are as follows: username, password="", email, fname, mname="", lname, gender, bio="", profilepic=""
    var user1 = new User("dijkstra_boro", "127609433", "dijkstra.boro@mail.com", "Boro","Vitek","Dijkstra","M","Food specialist. Music junkie. Reader. Professional tv fanatic. Introvert. Coffee aficionado. Bacon fan. Web advocate.","../img/dp/dijkstra_boro.webp");
    var user2 = new User("skinner_thomas","122665614","skinner.thomas@mail.com","Thomas","Dwain","Skinner","M","Pop culture ninja. Coffee enthusiast. Evil introvert. Social media scholar. Unapologetic internet geek. Tv fan.","../img/dp/skinner_thomas.webp");
    var user3 = new User("morita_haruka","190602232","morita.haruka@mail.com","Haruka","Yuzuki","Morita","F","Incurable bacon fan. Food nerd. Award-winning social media expert. Certified zombie maven. Friendly travel geek.","../img/dp/morita_haruka.webp");
    var user4 = new User("bogomolov_natalya","14670803","bogomolov.natalya@mail.com","Natalya","Yulia","Bogomolov","F","Tv expert. Extreme reader. Pop culture geek. Bacon guru. General explorer. Student. Organizer.","../img/dp/bogomolov_natalya.webp");

    users.push(user1,user2,user3,user4);

    //TODO: Build at least 2 posts per user and push each to posts[] (via Post())
    //Parameters (and its defaults) are as follows: user, description="", category="", label="", link="", imgblob=null, imgurl="", like=0, report=0, comment=[], posthash="", postid=-1, datetime = new Date()
    //Set imgblob as null for now
    //For posthash, use hash(string). Example shown below. Hopefully no hash-collision will occur.
    //Set your own post datetime as: new Date(year, month, day, hour, minute). 
    //Image Directory & Filename: "../img/post/<username>_<posthash>_product.jpg"
    //Fill posts = [];
    var testPost = [new Post(users[0], "A test button", "Test Category A", "Test Label", "Test Link", null, "https://www.ondemandcmo.com/wp-content/uploads/2016/03/canstockphoto22402523-arcos-creator.com_-1024x1024.jpg", 999, 0, testComment, "179889061", "postid", new Date(2022, 05, 01, 14, 20, 17)), new Post(users[2], "A Samsung M12", "Test Category B", "Test Label 2", "Test Link 2", null, "https://cf.shopee.ph/file/8de631b49ed3341cfad085f9be5582c9", 999, 0, testComment, "209406227", "postid", new Date(2022, 05, 01, 14, 20, 17))];
    posts = testPost.concat(posts); //DISABLE IF NOT USING testPost[]

    //TODO: Build comment list at any amount you'd like and push each to comments[] (via Comment())
    //Parameters: user, comment_text, posthash, timedate=new Date()
    //Make sure that posthash can be found on at least a post of posts[].
    //Fill comments = [];
    var testComment = [new Comment(users[1], "This is a comment", "179889061", new Date()), new Comment(users[2], "This is a comment 2", "179889061", new Date()), new Comment(users[0], "いいねスマホ―", "209406227", new Date())];
    comments = testComment.concat(comments); //DISABLE IF NOT USING testComment[]
}

/*MAIN*/

var newPostClicked = false;

$(document).ready(()=>{
    //COMMENCE SAMPLE DATA IN BACKGROUND
    autoFill();
    console.log(users);

    //Show Categories; Reference: https://stackoverflow.com/a/590219
    var options = $('#new-post-category');
    var list = []
    $("#new-post-category option").each(function(){
        list.push($(this).val());
    });
    console.log("Item Category Reference: ");
    console.log(list);
    
    //SETTING CURRENT USER
    currentUser = users[0];
    console.log("currentUser");
    console.log(currentUser);
    $("#profile-pic").attr("src", currentUser.profilepic);

    console.log(users);
    console.log(posts);
    console.log(comments);
    displayPosts(posts, comments);

    //EVENTLISTERNERS / ACTIONLISTENERS
    $("#new-post-btn").click((e)=>{
        var newPost = null;
        newPostClicked = true;
        updateColor();
        if(validateNewPost()){
            newPost = createPost();
            newPostClicked = false;
            posts.unshift(newPost);
            resetTimeline();
            displayPosts(posts);
        }
        else 
            console.log("New Post Data Incomplete");
    });

    $("#new-post-img-select").on("change",()=>{
        console.log("new-post-img");
        refreshNewPostImage();
    });

    $("#new-post-cancel-btn").click((e)=>{
        //TODO: DELETE VALUE INPUTS OF #new-post-form (Name: newPostForm) including input new-post-img-select
        //Call refreshNewPostImage(); after clearing input vals
        updateColor(true); //Restores text box for value triggered input BG color.
    });

    $("#new-post-form").change((e)=>{
        if(newPostClicked)
            updateColor();
    });

    $("#search-btn").click((e)=>{
        e.preventDefault();
        var filteredPosts = filterBySearch(posts,getSearch());
        resetTimeline();
        //Call sortbydate to filteredPosts or if getsearch() is empty then just display posts[] instead of filteredPosts[]
        displayPosts(filteredPosts,comments);
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
         * 
         * Call resetTimeline() prior to 
         */ 
    });

    /**
     * TODO: Add/implement dynamic event listeners on dynamically rendered elements/'objects'.
     * 
     * A video sample: https://www.youtube.com/watch?v=X8h7PgkM4QQ 
     * 
     * Each 'post card' and its children element (except for most sub-divs) has an attached 
     * posthash at the end of each ids to act as identifier if needed. 
     * 
     * Just like liking a post on FB only counts for that post
     *  
     * (I honestly don't know how it works just yet) 
     * 
     * Maybe sir has the "answer" on MC2 once we've figured it out.
     */
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
        //Sort in descending order (latest to earliest)
    }else{
        //Sort in ascending order (earliest to latest)
    }
    return sortedPosts;
}

/**
 * Filters posts by list of keywords on search
 * @param {list} searchList Keywords used for filtering posts
 * @returns Filtered Posts by Search value
 */
function filterBySearch(postList, searchList){
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
    console.log(searchVal.split(" "));
    return searchVal.split(" ");
}

/**
 * TODO
 * Iteratively posts specified in postList
 * Both parameter objects must be 'linked' or 'matching' each other.
 * 
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
    /**
     * TODO: Build a 'post card' object. Use buildPostCard(singlePost, postComments);
     * Append built 'post card' object to div class timeline
     */
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

    return post_card;
}

/**
 * Builds the upper portion of the post_footer including the post_footer itself.
 * @param {Post} post Post object that will be used to build the post_footer
 * @param {list} postComments List of comments that'll be used for the comment_list section of the footer.
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
    }); 

    $(post_footer).append(comments); //Appends comment list

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
 * TODO
 * Gets comments from comments[] that match the given posthash.
 * @param {post} post Post reference for finding comments related to it.
 * @returns List of filtered comments specified by post.
 */
 function getCommentsToPost(post, commentList){
    var postHash = post.posthash; //CAN BE SWITCHED TO 
    var filteredComments = [];
    /**
     * TODO: Iterate through comments[] and push all matching comments to
     * filteredComments[] using the posthash given. 
     */
    if(typeof(commentList) != "undefined") //NOT THE BEST FIX BUT IT'LL WORK
        for(c of commentList){
            if(c.posthash ==  postHash)
                filteredComments.push(c);
        }
    return filteredComments;
}

/**
 * Refreshes New Post Image Element
 * Either shows the element if an image (if there exists a selected file) or not (if otherwise).
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

/**
 * Searches the given thisPostHash on the given postList.
 * @param {list} postList 
 * @param {string} thisPostHash
 * @returns The index of the post that matches the thisPostHash given. Returns -1 if not found.
 */
function searchPostIndex(postList, thisPostHash){
    for(var p = 0; p < postList.length; p++){
        if(postList[p].posthash == thisPostHash)
            return p;
    }
    return -1;
}

/**
 * Creates a single Post object
 * @returns Post object
 */
function createPost(){
    //user, description="", category="", label="", link="", imgblob=null, imgurl="", like=0, report=0, comment=[], posthash="", postid=-1, datetime = new Date()
    let user = currentUser;
    let description = document.getElementById("new-post-content").value;
    let category = document.getElementById("new-post-category").value;
    let imgblob = null;
    let imgurl = getTempURL(getInputFile("new-post-img-select"));
    let label = document.getElementById("new-post-label").value;
    let link = document.getElementById("new-post-link").value;
    let like = 0;
    let posthash = hash(user.username+description);
    let postid = posts.length + 1;
    let comments = [];
    let report = 0;
    let datetime = new Date();
    var p = new Post(user,description,category,label,link,imgblob,imgurl,like,report,comments,posthash,postid,datetime);
    console.log(p);
    return p;
}

/**
 * Checks contents of newPostForm for invalidity (i.e. empty input).
 * @returns True if a valid post, false if otherwise
 */
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
 * Updates background colors of inputs found on specified form.
 * Form specified: document.forms.newPostForm
 * @param {boolean} restore Set true if will set all input BG color as normal, otherwise it will mark empty inputs as red. Default as false
 */
 function updateColor(restore=false){
    if(restore){
        for(f of new FormData(document.forms.newPostForm))
            if(f[0] != "new-post-img-select")
                changeBGColor(f[0], "var(--textbox)");
            else
            changeBGColor(f[0], "none");
    }else{
        for(f of new FormData(document.forms.newPostForm)){
            if(f[1] == "")
                changeBGColor(f[0], "var(--warning-light)");
            else if(!getInputFile("new-post-img-select"))
                changeBGColor(f[0], "var(--warning-light)");
            else
                if(f[0] != "new-post-img-select")
                    changeBGColor(f[0], "var(--textbox)");
                else
                    changeBGColor(f[0], "var(--primary)");
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