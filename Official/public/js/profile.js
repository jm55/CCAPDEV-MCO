console.log("Public JS: profile.js");

var currentPageId = null;

$(document).ready(()=>{
    $("#profilesearch-btn").click((e)=>{
        e.preventDefault();
        var searchString = $("#profilesearch").val();
        window.location.href='/profile/search/'+searchString;
    });
    
    $("#usersearch-btn").click((e)=>{
        e.preventDefault();
        var searchString = $("#usersearch").val();
        window.location.href='/user/'+targetUser+'/'+searchString;
    });
    
    $("#load-more-profile").click((e)=>{
        e.preventDefault();
        loadMoreProfile('/profile/search/more', $("#profilesearch").val());
    });

    $("#load-more-user").click((e)=>{
        e.preventDefault();
        var searchParam = $("#usersearch").val();
        if(searchParam == "")
            searchParam = '\'\'';
        loadMoreProfile('/user/'+targetUser+'/'+searchParam+'/more', $("#usersearch").val());        
    });
    currentPageId = pageid;
});

 function loadMoreProfile(url, searchString){
    var body = {};
    body['pageid'] = currentPageId;
    body['search'] = searchString;
    fetch(url,{
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }).then((data)=>{
        return data.json();
    }).then((data)=>{
        var posts = data['posts'];
        currentPageId = data['pageid'];
        if(posts.length == 0){
            $('#load-more-profile').css('display', 'none');
            $('#load-more-user').css('display', 'none');
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