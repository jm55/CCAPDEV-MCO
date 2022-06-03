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

/**
 * @todo
 */
function loadMore(){
    var body = {};
    body['pageid'] = currentPageId;
    console.log(body);
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
        /**
         * 
         * FOR EACH POST, BUILD A COMPLETE POST CARD AND APPEND TO .timeline
         * 
         */
        var timeline = document.getElementsByClassName("timeline");
        if(posts.length == 0){
            $('#load-more-home').css('display', 'none');
        }else{
            for(var p of posts){
                console.log(p);
            }
        }
    }).catch((error)=>{
        console.error(error);
    });
}