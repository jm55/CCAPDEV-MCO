console.log("Public JS: signup.js loaded!");

var submitClicked = false;

 $(document).ready(()=>{
    $("#bio-counter").text("0/255");

    $("#signup-btn").click((e)=>{
        e.preventDefault();
        submitClicked = true;
        
        updateColor();
        if(validateSignupInputs())
            makeProfile();
        else
            alert("Please check your inputs again");
    });

    $("#login-btn").click(()=>{
        loginRedirect();
    });

    $("#clear-btn").click(()=>{
        clearSignup();
    });

    $("#bio").keyup(()=>{
        updateTextCount();
    });

    $("#bio").keydown(()=>{
        updateTextCount();
    });

    $("#profilepic-select").on("change", ()=>{
        refreshDP();
    });

    $("input").keyup((e)=>{
        if(submitClicked)
            updateColor();
    });

    $("select").on("change",(e)=>{
        if(submitClicked)
            updateColor();
    });

    $("#signup-btn").keyup((e)=>{
        updateColor();
    });
});

function makeProfile(){
    var fmd = new FormData(document.forms.signupform);
    fetch("/signup/save",{
        method: "POST",
        body: fmd,
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {// SUCCESS
            console.log(res);
            window.location.href = '/login';
        }else if(res.status == 403){
            alert('Username already in use');
        }else{
            console.log(res.status);
        }
    }).catch((error) => {
        console.error(error);
    });
}

function refreshDP(){
    var file = getInputFile("profilepic-select");
    if(file){ //check if it exists
        $("#profilepic").attr("src",getTempURL(file));
        $("#error-profilepic-select").text("");
    }
    else{
        $("#profilepic").attr("src","../img/default/default_dp.webp");
        errMessage("refreshDP", "Error with file");
    }
}

function validateSignupInputs(){    
    var form = new FormData(document.forms.signupform);
    //console.log(form);
    var validity = true;
    var prevHash = "";
    for(var f of form){
        if(String(f[1]).length == 0){
            if(f[0] != "mname" && f[0] != "bio" && f[0] != "profilepic-select"){
                errMessage("validateSignupInputs",  f[0] + " not filled")
                validity = false;
            }
        }else{
            //CHECK EMAIL IF IT CONTAINS AT LEAST AN @
            if(f[0] == "email"){
                if(!validator.isEmail(f[1])){
                    errMessage("validateSignupInputs", "Invalid email");
                    $("#error-" + f[0]).text("* Invalid email address");
                    changeBGColor(f[0], "var(--warning-light)");
                    validity = false;
                }
            } 
            
            //CHECK PASSWORD IF SAME, RECOMMENDED TO BE HASHED BEFORE COMPARING
            if(f[0] == "password_a"){
                prevHash = String(f[1]);
            }
            if(f[0] == "password_b"){
                if(!prevHash===String(f[1])){
                    errMessage("validateSignupInputs", "Mismatched passwords");
                    $("#error-" + f[0]).text("* Passwords do not match");
                    changeBGColor(f[0], "var(--warning-light)");
                    validity = false;
                }
            }
            
            if(f[0] == "profilepic-select"){
                if(getInputFile("profilepic-select") == null){
                    errMessage("validateSignupInputs", "No Profile Picture Set");
                    $("#error-" + f[0]).text("* No Profile Picture set");
                    validity = false;
                }
            }
        }   
    }
    return validity;
}

function clearSignup(){
    var form = new FormData(document.forms.signupform);
    for(f of form){
        $("#" + f[0]).val("");
        ($("#error-" + f[0])).text("");
        if(f[0] == "profilepic-select"){
            changeBGColor(f[0], "var(--primary)");
        }
        else if(f[0] == "gender"){
            changeBGColor(f[0], "var(--primary-button)");
        }
        else{
            changeBGColor(f[0], "var(--textbox)");
        }
    }
    refreshDP();

    submitClicked = false;
}

function loginRedirect(){
    window.location.href = "/login";
}

function setDefaultErrorMessage(id){
    let errorMessage;
    switch(id){
        case "profilepic-select": 
            errorMessage = "* Upload a Profile Picture";
            break;
        case "username":
            errorMessage = "* Enter a username";
            break;
        case "password_a":
            errorMessage = "* Enter a password";
            break;
        case "password_b":
            errorMessage = "* Confirm your password";
            break;
        case "email":
            errorMessage = "* Enter your email";
            break;
        case "fname":
            errorMessage = "* Enter your first name";
            break;
        case "lname":
            errorMessage = "* Enter your last name";
            break;
        case "gender":
            errorMessage = "* Select a gender";
            break;
        // case "bio":
        //     errorMessage = "* Enter a bio";
        //     break;
        default:
            errorMessage = "Unknown id";

    }
    $("#error-" + id).text(errorMessage);
}

function updateTextCount(limit=255, alert=true){
    let n = $("#bio").val().length;
    let s = "";
    if(n >= limit)
        s = limit + "/" + limit;
    else
        s = n + "/" + limit;
    
    $("#bio-counter").text(s);
}

function getTempURL(file){
    return URL.createObjectURL(file);
}

function getInputFile(id){
    //Reference: https://stackoverflow.com/a/15792918 & https://stackoverflow.com/a/4459419
    var inputFile = document.getElementById(id); //Get inputFile element
    var files = inputFile.files; //Get files of input
    return files[0]; //Returns only the first file
}

function errMessage(functionName, msg){
    console.log(functionName + "(): ", msg);
}

function hash(s) {
    /* Simple hash function. */
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        /*jshint plusplus:false bitwise:false*/
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a);
}

 function updateColor(){
    for(f of new FormData(document.forms.signupform)){
        if(!(f[0]=="mname" && f[0]=="profilepic-select") && !(f[0]=="bio")){
            if(f[1] == ""){
                changeBGColor(f[0], "var(--warning-light)");
                setDefaultErrorMessage(f[0]);
            }
            else{
                changeBGColor(f[0], "var(--textbox)");
                $("#error-" + f[0]).text("");
            }
        }
    }
}

function changeBGColor(id, color){
    document.getElementById(id).style.backgroundColor = color;
}