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
});

function loadMore(){
    var body = {};
    body['pageid'] = currentPageId;
    body['search'] = "";
    body['categories'] = "";
    fetch('/home/more',{
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
            $('#load-more-home').css('display', 'none');
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