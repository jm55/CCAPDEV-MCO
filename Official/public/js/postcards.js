//TODO
function submitLike(posthash){
    console.log("Like: " + posthash + " from " + userId);
    fetch("/post/like",{
        
        headers:{
            "Content-Type": "application/json"
        }
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            console.log("Like " + posthash + " success");
        } else {// ERROR
            console.log("response error: " + res.status);
        }
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
    fetch("/post/Report",{
        headers:{
            "Content-Type": "application/json"
        }
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
    fetch("/post/comment",{
        headers:{
            "Content-Type": "application/json"
        }
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