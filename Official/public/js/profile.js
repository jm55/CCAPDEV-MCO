console.log("Public JS: profile.js");

var currentPageId = null;

$(document).ready(()=>{
    $("#profilesearch-btn").click((e)=>{
        e.preventDefault();
        var searchString = $("#profilesearch").val();
        if(searchString == "")
            searchString = '\'\'';
        window.location.href='/profile/'+searchString;
    });
    $("#load-more-profile").click((e)=>{
        e.preventDefault();
        loadMoreProfile();
    });
    $("#usersearch-btn").click((e)=>{
        e.preventDefault();
        var searchString = $("#usersearch").val();
        /**
         * 
         * FETCH TO /user/:posthash/search
         * 
         */
    });
    currentPageId = pageid;
});

/**
 * @todo
 */
 function loadMoreProfile(){
    var body = {};
    body['pageid'] = currentPageId;
    body['search'] = document.getElementById('profilesearch').value;
    fetch('/profile/search/more',{
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }).then((data)=>{
        return data.json();
    }).then((data)=>{
        //var user = data['user'];
        var posts = data['posts'];
        currentPageId = data['pageid'];
        if(posts.length == 0){
            $('#load-more-profile').css('display', 'none');
        }else{
            for(var p of posts){
                var newPost = buildPostCard(p,p.comments,userId);
                $(newPost).insertBefore('#load-more-div');
            }
        }
    }).catch((error)=>{
        console.error(error);
    });
}