console.log('Public JS: postbuilder.js');

function buildPostCard(singlePost, postComments,userId){
    //Prepare footer elements
    var footer = buildPostFooter(singlePost,userId);
    var footer_comments = buildPostComments(singlePost, postComments);
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
            var tablebody = document.createElement('tbody');
            var post_table = document.createElement("table");
                var tr0 = document.createElement("tr");
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
        $(item_link).addClass("item_link");
        $(category_link).addClass("item_category_link");
        $(post_image_div).addClass("post_image_div");
        $(post_image).addClass("post_image");

        //Adding hrefs
        $(username).attr("href","/user/" + singlePost.user.username); //user link of singlePost.user
        $(category_link_a).attr("href","/search/''." + singlePost.category); //link to category
        $(item_link_a).attr('href',singlePost.link);

        //Adding inner text
        $(username).text(singlePost.user.username);
        $(post_description_text).text(singlePost.description);
        $(item_link_a).text(singlePost.label);
        $(category).text("Category:");
        $(category_link_a).text(singlePost.category);

        //Adding image srcs
        $(post_image).attr("src", singlePost.imgurl);
        $(postdp).attr("src", singlePost.user.profilepic);

        //Add other attributes
        $(postdp).attr("alt","Profile Picture");
        //$(post_image).attr("loading", "lazy");
        $(item_link_a).attr("href", singlePost.link);
        $(item_link_a).attr("target", "_blank");
        $(post_card).attr('id', '');
        $(post_card).attr('postHash', singlePost.postHash);
        $(post_card).attr('author', singlePost.userId);
        $(postdp).attr('onerror', "this.src='/img/default/imagenotfound.webp'");
        $(postdp).attr('loading', "lazy");
        $(postdp).attr('alt', "Profile Picture");
        $(post_image).attr('alt', "Post Picture");
        $(post_image).attr('loading', "lazy");
        $(post_image).attr('onerror', "this.src='/img/default/imagenotfound.webp'");

        //APPENDING
        //Header
        $(post_user).append(postdp);
        $(post_user).append(username);
        $(post_header).append(post_user); //Complete
        //Content: post_description
        $(post_description).append(post_description_text); //Complete
        //Content: post_list
        $(item_link).append(item_link_a);
        $(tr0).append(item_link);
        $(category_link).append(category_link_a);
        $(tr1).append(category);
        $(tr1).append(category_link);
        $(post_table).append(tr0);
        $(post_table).append(tr1); //Complete
        $(tablebody).append(post_table);
        $(post_list).append(tablebody);
        //Content: post_image_div
        $(post_image_div).append(post_image); //Complete
        //Content: post_content
        $(post_content).append(post_header);
        $(post_content).append(post_description);
        $(post_content).append(post_list);
        $(post_content).append(post_image_div);
        
        $(post_card).append(post_content);
        $(post_card).append(footer);

        $(post_card).attr("postHash", singlePost.postHash);
    }
    
    return post_card;
}

function buildPostFooter(singlePost, userId){
    //DIVs
    var post_footer = document.createElement("div");
    var likes_div = document.createElement("div");
    var interact = document.createElement("form");
    //Ps
    var likecounter = document.createElement("p");
    var post_timedate = document.createElement("p");
    var edit_timedate = document.createElement("p");
    //INTERACTs
    var likeBtn = document.createElement("input");
    var shareBtn = document.createElement("input");
    var reportBtn = document.createElement("input");
    var editBtn = document.createElement("input");
    var comment = document.createElement("input");
    var submit = document.createElement("input");
    {
        //Setting className();
        $(post_footer).addClass("post_footer");
        $(likes_div).addClass("likes")
        $(interact).addClass("interact");
        $(likecounter).addClass("likecounter");
        $(post_timedate).addClass("post_timedate");
        $(edit_timedate).addClass('post_timedate');
        $(likeBtn).addClass("button");
        $(shareBtn).addClass("button");
        $(reportBtn).addClass("button");
        $(editBtn).addClass("button");
        $(comment).addClass("textfield");
        $(comment).addClass("comment_textfield");
        $(submit).addClass("button");
        
        //Adding IDs&names
        //IDs
        $(likecounter).attr("id","likeCounter" + singlePost.postHash);
        $(interact).attr("id","interact#" + singlePost.postHash);
        $(likeBtn).attr("id","like-button" + singlePost.postHash);
        $(shareBtn).attr("id","share-button" + singlePost.postHash);
        $(reportBtn).attr("id","report-button" + singlePost.postHash);
        $(editBtn).attr("id","edit-button" + singlePost.postHash);
        $(comment).attr("id","comment" + singlePost.postHash);
        $(submit).attr("id","submit-comment" + singlePost.postHash);
        //names
        $(interact).attr("name","interact#" + singlePost.postHash);
        $(comment).attr("name","comment#" + singlePost.postHash);
        //values
        $(interact).attr("id","interact#" + singlePost.postHash);
        $(likeBtn).attr("id","like-button" + singlePost.postHash);
        $(shareBtn).attr("id","share-button" + singlePost.postHash);
        $(reportBtn).attr("id","report-button" + singlePost.postHash);
        $(comment).attr("id","comment#" + singlePost.postHash);
        $(submit).attr("id","submit-comment" + singlePost.postHash);
        //type
        $(likeBtn).attr("type","button");
        $(shareBtn).attr("type","button");
        $(reportBtn).attr("type","button");
        $(editBtn).attr("type","button");
        $(submit).attr("type","button");
        $(comment).attr("type","text");
        //onclicks
        $(likeBtn).attr("onclick","submitLike(\'" + singlePost.postHash + "\')");
        $(shareBtn).attr("onclick","showShare(\'" + singlePost.postHash + "\')");
        $(reportBtn).attr("onclick","submitReport(\'" + singlePost.postHash + "\')");
        $(editBtn).attr("onclick","editForward(\'" + singlePost.postHash + "\')");
        $(submit).attr("onclick","submitComment(\'" + singlePost.postHash + "\')");
        //visibility
        $(editBtn).css('display','none');
        if(singlePost.userId == userId)
            $(editBtn).css('display','block');

        //Adding innerHTML
        if(singlePost.likeVals.length > 1)
            $(likecounter).text("Like: "  + singlePost.likeVals.length);
        else
            $(likecounter).text("Likes: " + singlePost.likeVals.length);
        $(post_timedate).text("Posted: " + singlePost.datetime);
        if(singlePost.editdatetime)
            $(edit_timedate).text('Edited: ' + singlePost.editdatetime);
        
        //Button values
        $(likeBtn).attr('value',"Like");
        for(var l of singlePost.likeVals)
            if(l.userId == userId)
                $(likeBtn).attr('value',"Liked");
        $(shareBtn).attr('value',"Share");
        $(reportBtn).attr('value',"Report");
        $(editBtn).attr('value',"Edit");
        $(submit).attr('value',"Comment");

        //APPENDING
        $(likes_div).append(likecounter);
        $(likes_div).append(post_timedate);
        if(singlePost.editdatetime)
            $(likes_div).append(edit_timedate);
        $(interact).append(likeBtn);
        $(interact).append(shareBtn);
        $(interact).append(reportBtn);
        $(interact).append(editBtn);
        $(interact).append(comment);
        $(interact).append(submit);
        $(post_footer).append(likes_div);
        $(post_footer).append(interact);
    }

    return post_footer;
}

function buildPostComments(post, postComments){
    var comment_list = document.createElement("div");
    $(comment_list).addClass("comment_list");
    $(comment_list).attr("id","comments_div" + post.postHash);

    if(postComments || postComments > 0){
        for(var p of postComments){
            $(comment_list).append(buildPostComment(p)); //uses buildPostComment() for each comments
        }
    }

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
    $(comment_date).addClass("comment-timedate");

    //Href for username
    $(commenter).attr("href","/user/" + postComment.username); //TO BE UPDATED WITH THE USER LINK

    //Add innerHTML
    $(commenter).text(postComment.username);
    $(comment).text(postComment.text);
    $(comment_date).text(postComment.datetime);

    //Appending
    $(comment_div).append(commenter);
    $(comment_div).append(comment);
    $(comment_div).append(comment_date);

    return comment_div;
}