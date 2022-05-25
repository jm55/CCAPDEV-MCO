import express from 'express';

const profileNav = express.Router();

//Profile
profileNav.get('/profile', (req, res)=>{
    console.log(req.url);
    res.render("profile",  {title: "{{user}} - Budol Finds"});
});

//Profile Settings
profileNav.get('/profile_settings', (req, res)=>{
    console.log(req.url);
    res.render("profile_settings",  
        {
            title: "Profile Settings - Budol Finds",
            currentUser: currentUser,
            currentUserJSON: JSON.stringify(currentUser),
            helpers:{

            }
        });
});

export default profileNav;