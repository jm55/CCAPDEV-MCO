console.log("Public JS: logout.js");
$( document ).ready((e)=>{
    //Note who is logging out and when
    var logoutRequest = {userid: null, datetime: new Date()};
    console.log("Logging out...");
    fetch("/logout/out",{
        method: "POST",
        body: JSON.stringify(logoutRequest),
        headers:{"Content-Type": "application/json"}
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            window.location.href = '/';
        } else {// ERROR
            console.log("Response Error: " + res.status);
        }
    }).catch((error) => {
        console.error(error);
    });
});