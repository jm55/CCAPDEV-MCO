//TODO
function submitLike(posthash){
    console.log("Like: " + posthash + " from " + userId);
    
    //Same structure for Report
    var body = {};
    body['userId'] = userId;
    body['postHash'] = posthash;
    body['datetime'] = new Date();

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

//TODO
function showShare(posthash){
    console.log("Share: " + posthash + " from " + userId);
}

//TODO
function submitReport(posthash){
    console.log("Report: " + posthash + " from " + userId); 
    fetch("/post/"+posthash+"/report",{
        headers:{"Content-Type": "application/json"}
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            console.log("Report " + posthash + " success");
        } else {// ERROR
            console.log("response error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    }); 
}

//TODO
function submitComment(posthash){
    console.log("Comment: " + posthash + " from " + userId);
    
    var body = {};
    body['userId'] = userId;
    body['text'] = document.getElementById("comment#"+posthash).value;
    body['postHash'] = posthash;
    body['datetime'] = new Date();

    fetch("/post/comment",{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(body)
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            console.log("Comment " + posthash + " success");
        } else {// ERROR
            console.log("response error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}