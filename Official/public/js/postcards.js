//console.log('postcards.js');

function submitLike(posthash){
    console.log("Like: " + posthash + " from " + userId);
    
    //Same structure for Report
    var body = {};
    body['userId'] = userId;
    body['postHash'] = posthash;
    body['datetime'] = new Date();
    body['currentCount'] = document.getElementById('likeCounter'+ posthash).textContent.split(' ')[1];

    fetch("/post/like",{
        method:'POST',
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(body),
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            return res.json();
        } else {// ERROR
            console.log("response error: " + res.status);
        }
    }).then(data=>{
        if(data){
            document.getElementById('like-button' + posthash).value = data['btn'];
            document.getElementById('likeCounter' + posthash).textContent = data['count'];
        }else
            alert('Server side error occured, please refresh the page.');
    }).catch((error) => {
        console.error(error);
    });
}

async function showShare(posthash){ 
    console.log("Share: " + posthash + " from " + userId);
    var url = String(window.location.href);
    var edge = url.lastIndexOf('/');
    var link = url.substring(0, edge) + '/post/' + posthash;
    navigator.clipboard.writeText(link);//Reference: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    //alert("Copy link: " + link);
    alert('Link has been copied to the clipboard');
}

function popUp(){
     
}

function editForward(posthash){
    window.location.href = '/post/' + posthash + '/edit';
}

function submitReport(posthash, postOwnerId){
    console.log("Report: " + posthash + " from " + userId);
    //userId, posthash, datetime
    var body = {};
    body['userId'] = userId;
    body['postOwnerId'] = postOwnerId;
    body['postHash'] = posthash;
    body['datetime'] = new Date();
    fetch("/post/report",{
        method:'POST',
        body: JSON.stringify(body),
        headers:{"Content-Type": "application/json"}
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            alert('Report has been sent!');
            document.getElementById('report-button' + posthash).style.display = 'none';
            console.log("Report " + posthash + " success");
        } else {// ERROR
            console.log("response error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    }); 
}

function submitComment(posthash){
    console.log("Comment: " + posthash + " from " + userId); 
    var commentVal = document.getElementById("comment#"+posthash).value;

    if(commentVal == "") //PREVENTS EMPTY COMMENTS
        return null;

    var body = {};
    body['userId'] = userId;
    body['text'] = commentVal;
    body['postHash'] = posthash;
    body['datetime'] = new Date();
    body['username'] = username;

    fetch("/post/comment",{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(body)
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            var parent = document.getElementById('comments_div'+posthash);
            var comment = buildComment(userId, body['text'], username, body['datetime']);
            $(comment).insertAfter(parent.childNodes[1]);
            document.getElementById("comment#"+posthash).value = "";
        } else {// ERROR
            console.log("response error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

function buildComment(id, comment, username, datetime){
    var div = document.createElement('div');
    div.setAttribute('class', 'comment_div');
    
    var usernameA = document.createElement('a');
    usernameA.setAttribute('href','/user/'+username);
    usernameA.setAttribute('class','username');
    usernameA.textContent = username;
    div.appendChild(usernameA);

    var textP = document.createElement('p');
    textP.textContent = comment;
    div.appendChild(textP);

    var datetimeP = document.createElement('p');
    datetimeP.setAttribute('class', 'comment-timedate');
    datetimeP.textContent = datetime.toISOString();
    div.appendChild(datetimeP);

    return div;
}