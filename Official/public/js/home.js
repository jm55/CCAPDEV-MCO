console.log("Public JS: home.js loaded");

var newPostClicked = false;
var currentPageId = null;

$(document).ready(()=>{
    $("#cancel-btn").click((e)=>{
        newPostClicked = false;
        clearInputs();
        updateColor(true);
    });

    $("#form").change((e)=>{
        if(newPostClicked)
            updateColor();
    });

    $("#category").on("change", (e)=>{
        var cat = document.getElementById("category").value;
        console.log("new post category: " + cat);
    });
    $("#load-more-home").click((e)=>{
        e.preventDefault();
        loadMore();
    });
    currentPageId = pageid;
    console.log('starting page: ' + currentPageId);
});

function loadMore(){
    var body = {};
    body['pageid'] = currentPageId;
    fetch('/debug/home/more',{
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }).then((data)=>{
        return data.json();
    }).then((data)=>{
        //var user = data['user'];
        var posts = data['posts'];
        currentPageId = data['pageid'];

        /**
         * 
         * FOR EACH POST, BUILD A COMPLETE POST CARD AND APPEND TO .timeline
         * 
         */

    }).catch((error)=>{
        console.error(error);
    });
}

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
        $(item_link_a).text(singlePost.link);
        $(category).text("Category: ");
        $(category_link_a).text(singlePost.category);

        //Adding image srcs
        $(post_image).attr("src", singlePost.imgurl);
        $(postdp).attr("src", singlePost.user.profilepic);

        //Add other attributes
        $(postdp).attr("alt","Profile Picture");
        //$(post_image).attr("loading", "lazy");
        $(item_link_a).attr("href", singlePost.link);
        $(item_link_a).attr("target", "_blank");

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

        $(post_card).attr("posthash", singlePost.posthash);
    }
    
    return post_card;
}

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
    //TODO: when pressing enter on the comment box, it likes the post instead of submitting the comment
    likeBtn.addEventListener("click", function(e){
        e.preventDefault();

        //Get post index to post
        var thisIndex = searchPostIndex(posts, singlePost.posthash);

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
        alert("Temporary\nReport Object will be created as supposed to earlier data design considerations of just counting the reports done on the post.\nPost Hash: " + singlePost.posthash);
    });

    submit.addEventListener("click", (e)=>{
        e.preventDefault();
        if($(comment).val() != ""){
            comments.push(new Comment(currentUser, $(comment).val(), singlePost.posthash, new Date()));
            insertNewComment(comments[comments.length-1]);
            $(comment).val("");
        }
    });

    return post_footer;
}

function buildPostComments(post, postComments){
    var comment_list = document.createElement("div"); //HOLDS ALL COMMENTS
    $(comment_list).addClass("comment_list");
    $(comment_list).attr("posthash",post.posthash);

    //Iterate through all postComments and append to comment_list
    for(p of postComments)
        $(comment_list).append(buildPostComment(p)); //uses buildPostComment() for each comments

    return comment_list;
}

function buildPostComment(postComment){
    var comment_div = document.createElement("div");
    var commenter = document.createElement("a");
    var comment = document.createElement("p");
    var comment_date = document.createElement("p");

    //Assign classes
    $(comment_div).addClass("comment_div");
    $(commenter).addClass("username");
    $(comment_date).addClass("comment_date");
    $(comment).addClass("comment_body");

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