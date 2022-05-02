//test_post.js
console.log("test_post.js");

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
                        posthash="", postid="-1", datetime = new Date()){
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
    //TO ADD IN THE FUTURE => this.userID = hash(this.username+dateCreated.tostring())

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
    this.timedate = timedate;
}

var users = [];
var posts = [];
var comments = [];
var currentUser = null;
var testComment = null;
var testPost = null;

$(document).ready(()=>{
    autoFill();
    currentUser = users[0];
    
    //TESTING BUILD
    testComment =   [   new Comment(users[1], "This is a comment", "179889061", new Date()), 
                        new Comment(users[2], "This is a comment 2", "179889061", new Date()),
                        new Comment(users[0], "いいねスマホ―", "209406227", new Date())
                    ];
    testPost =  [   new Post(users[0], "This is a test Post", "Test Category A", "Test Label", "Test Link", null, "https://www.ondemandcmo.com/wp-content/uploads/2016/03/canstockphoto22402523-arcos-creator.com_-1024x1024.jpg", 999, 0, testComment, "179889061", "postid", new Date(2022, 05, 01, 14, 20, 17)),
                    new Post(users[2], "This is a test Post 2", "Test Category B", "Test Label 2", "Test Link 2", null, "https://cf.shopee.ph/file/8de631b49ed3341cfad085f9be5582c9", 999, 0, testComment, "209406227", "postid", new Date(2022, 05, 01, 14, 20, 17))
                ];
    
    console.log(testComment);
    console.log(testPost);

    //POST CARD
    var samplePostCard1 = buildPostCard(testPost[0],testComment);
    var samplePostCard2 = buildPostCard(testPost[1],testComment);
    $(".timeline").append(samplePostCard1);
    $(".timeline").append(samplePostCard2);
});

/**
 * TODO
 */
 function autoFill(){
    console.log("autoFill()");
    var user0 = new User("dlsu","237392540","dlsu@mail.com","De La Salle", "University", "Manila", "M", "Animo La Salle", "../img/dp/dlsu_dp.webp"); //SAMPLE LOGGED IN USER
    users.push(user0);

    //FOR ALL TODOs, GO TO FOLDER 'sample_data' FOR ALL CSVs THAT YOU CAN USE EXCEL WITH FOR A MUCH EASIER BUILDING, BUT REMEMBER TO ADD "" IF OBJECTS ARE TYPEOF stringS

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
    let samplehash = hash("username" + "description"); //Sample use of hash

    //TODO: Build comment list at any amount you'd like and push each to comments[] (via Comment())
    //Parameters: user, comment_text, posthash, timedate=new Date()
    //Make sure that posthash can be found on at least a post of posts[].
    for(c of comments) //You may delete this once you've verified matching hashes.
        console.log(c);
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
 function displayPosts(postList){
    var posts = [];
    for(p of postList){
        var filteredComments = getCommentToPost(p);
        posts.unshift(displayPost(p, filteredComments));
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
    var postCard = buildPostCard(singlePost, postComments);
    $(".timeline").append(postCard);
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
            var user_anchor = document.createElement("a");
                var post_user = document.createElement("span");
                    var postdp = document.createElement("img");
                        var username = document.createElement("p");
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
    $(user_anchor).attr("href",""); //user link of singlePost.user
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
    $(post_image).attr("loading", "lazy");

    //APPENDING
    //Header
    $(post_user).append(postdp);
    $(post_user).append(username);
    $(user_anchor).append(post_user);
    $(post_header).append(user_anchor); //Complete
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
    
    /**
     *  <div id="" class="post card"> <!--BUILD ID BASED ON POST ID/HASH; SINGLE POST-CARD BLOCK - REPETITIVE-->    

            <!--POST CONTENT: ALL DATA ABOUT THE POST-->
            <div class="post_content"> <!--SINGLE POST-CONTENT BLOCK - DON'T REPEAT-->
            

                ...
                POST FOOTER CALLED USING buildPostFooter();
                ...
        </div>
     * 
     * Target to make is contents of div class="post card"
     * For object/node of div class comment_list call buildPostComments(post, postComments)
     * 
     * Reminder: For every element, use '<classname>+posthash' as the element's id for easier element tracking/identification
     * 
     */
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

    $(post_footer).append(comments); //Appends comment list
    
    /**
     *  <div class="post_footer">
            <div class="likes">
                <p class="likecounter"><!--LIKES HERE--></p> <!--BUILD ID AND TEXT VALUE AT JS BASED ON POST ID/HASH AND LIKE COUNT-->
                <p class="post_timedate"><!--POST DATE-TIME HERE--></p> <!--BUILD TEXT VALUE AT JS BASED ON POST DATETIME-->
            </div>
            <form class="interact" name="interact#hash">
                <button class="button" id="like-button#hash" name="likeBtn#hash">Like</button>
                <button class="button" id="share-button#hash" name="shareBtn#hash">Share</button>
                <button class="button" id="report-button#hash" name="reportBtn#hash">Report</button>
                <input type="text" class="textfield comment_textfield" id="comment#hash" name="comment#hash">
                <input type="submit" class="button" id="submit-comment#hash" name="submitComment#hash" value="Comment"/>
            </form>
            ...
            HANDLED BY buildPostComments();
            ...
        </div
     */

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
    $(comment).text(postComment.comment_text);
    $(comment_date).text(postComment.timedate);

    //Appending
    $(comment_div).append(commenter);
    $(comment_div).append(comment);
    $(comment_div).append(comment_date);

    /**
     *  <div class="comment_div"> <!--SINGLE COMMENT BLOCK - REPETITIVE-->
            <a href="" class="username"><!--COMMENTER USERNAME HERE--></a><!--BUILD HREF VALUE AT JS BASED ON COMMENT OBJECT DATA--->
            <p><!--COMMENT HERE--></p> <!--BUILD TEXT VALUE AT JS BASED ON COMMENT OBJECT DATA--->
            <p class="comment_timedate"><!--COMMENT DATETIME HERE--></p> <!--BUILD TEXT VALUE AT JS BASED ON COMMENT DATETIME DATA--->
        </div>
     */
    return comment_div;
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
 * 
 * GLOBALS
 * 
 */

/**
 * Simple Hash Function (for emulation purposes)
 * Reference: https://gist.github.com/iperelivskiy/4110988
 * @param {string} s string to be hashed
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