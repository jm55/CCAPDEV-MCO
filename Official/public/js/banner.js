console.log("Public JS: banner.js loaded");
var currentPageId = null;

$(document).ready(()=>{
    var cat = $("#categories").attr("value");
    $("#categories").val(cat);


    $("#home-btn").click(()=>{
        console.log("#home-btn clicked");
        window.location.href = "/home";
    });

    $("#userbutton").click(()=>{
        console.log("#userbutton clicked");
        window.location.href = "/profile";
    });

    $("#account-settings-btn").click(()=>{
        console.log("#account-settings-btn clicked");
        window.location.href = "/profile/settings"
    });
    
    $("#logout-btn").click(()=>{
        console.log("#logout-btn clicked");
        window.location.href = "/logout";
    });

    $("#categories").on("change", (e)=>{
        var cat = document.getElementById("categories").value;
        console.log("menu category: " + cat);
    });

    $("#search-btn").click((e)=>{
        console.log("#search-btn");
        search();
    });

    $("#search-txt").keyup((e)=>{
        e.preventDefault();
        if(e.key=="Enter"){
            console.log("#search-txt");
            search();
        }
    });

    $('#load-more-search').click((e)=>{
        e.preventDefault();
        loadMoreSearch();
    });
    currentPageId = pageid;
});

function search(){
    var search = document.getElementById('search-txt').value;
    var category = document.getElementById('categories').value;
    if(search=="")
        search = '\'\'';  
    if(category=="")
        category = '\'\'';
    window.location.href='/search/'+search+'.'+category;
}

 function loadMoreSearch(){
    var body = {};
    body['pageid'] = currentPageId;
    body['search'] = document.getElementById('search-txt').value;
    body['categories'] = document.getElementById('categories').value;
    fetch('/search/more',{
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
            $('#load-more-search').css('display', 'none');
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