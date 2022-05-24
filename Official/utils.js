console.log("home.js loaded");
/*
===================================================================================

OBJECTS

===================================================================================
*/
/**
 * Post Object
 * @param {string} userID UserID of the the User of the post
 * @param {string} description Description of the Post
 * @param {string} posthash Post hash of the post
 * @param {string} category Category of Post Item
 * @param {string} label Label of product in post item
 * @param {string} link Link of product in post item
 * @param {*} imgblob Image in blob type //NULL 
 * @param {string} imgurl Image in URLtype
 * @param {Number} like Number of likes; Default: 0
 * @param {Number} report Report count //TO BE REPLACED BY A Report object
 * @param {list} comment Comment objects
 * @param {Date} datetime Date and Time of Post; Default: new Date()
 */
 const Post = function(userID, description="", 
                        category="", label="", link="", imgblob=null, imgurl="", 
                        like=0, report=0, comment=[], 
                        posthash="", datetime = new Date()){
    this.userID = userID;
    this.description = description;
    this.posthash = posthash;
    this.category = category;
    this.imgblob = imgblob;
    this.imgurl = imgurl;
    this.like = like;
    this.report = report;
    this.comment = comment;
    this.datetime = datetime;
    this.label = label;
    this.link = link;
}
/**
 * User Profile or User Object
 * @param {string} username Username
 * @param {string} password Password (Refers to password_b at signup and settings)
 * @param {string} email Email
 * @param {string} fname First Name
 * @param {string} mname Middle Name
 * @param {string} lname Last Name
 * @param {string} gender Gender
 * @param {string} bio Biography
 * @param {string} profilepic ProfilePic (string? or blob? NOT YET SURE)
 * @param {Date} dateCreated Used as reference values for hashing userID. Defaults to new Date() but can be set as constant when prototyping users.
 * @param {string} userID Identifier for user, leave as null by default if a new account.
 */
 const User = function(username, password="", email, fname, mname="", lname, gender, bio="", profilepic="", dateCreated=new Date(), userID=null){
    this.username = username;
    this.password = password; //acts more as a passhash than a password
    this.email = email;
    this.fname = fname;
    this.mname = mname;
    this.lname = lname;
    this.gender = gender;
    this.bio = bio;
    this.profilepic = profilepic; //TO BE UPDATED TO POINT TO SERVER DIRECTORY AT '../img/dp/<username>.jpg'; BY CURRENT DESIGN, IF USERNAME WAS CHANGED, THE DP WILL BE SAVED AGAIN AS NEW FILE WITH NEW FILENAME (I.E. USERNAME)
    this.formal_name = lname + ", " + fname + " " + mname.substring(0,1);
    if(userID == null)
        this.userID = hash(this.username+dateCreated.toString); //hash() must be on the same area as User constructor; DON'T IMPLEMENT FOR PHASE 1 JUST YET
    else
        this.userID = userID;
    //IF A CLASS, ADD FUNCTION TO SAVE URL/BLOB AS FILE TO SERVER AT '../img/dp/<username>.jpg'
}
/**
 * Comment Object
 * @param {string} userID UserID of the User that posted the comment
 * @param {string} comment_text Content of comment
 * @param {string} posthash Post that it is attached to 
 * @param {Date} datetime Date and time of the comment posted
 */
 const Comment = function(user, comment_text, posthash, datetime=new Date()){
    this.user = user; //userID
    this.comment_text = comment_text;
    this.posthash = posthash;
    this.datetime = datetime;
}


/*
===================================================================================

FOR DEMONSTRATION PURPOSES
SAMPLE SCRIPTED DATA

===================================================================================
*/
var users = [];
var posts = []; //USER OBJECT IN POSTS ARE TEMPORARY, WILL BE REPLACED WITH USERID FOR FLEXIBLE USER ADDRESSING
var comments = [];
var currentUser = null;

/**
 * Builds the list of sample users, posts, and comments.
 */
 function autoFill(){
    var user0 = new User("dlsu","237392540","dlsu@mail.com","De La Salle", "University", "Manila", "M", "Animo La Salle", "../img/dp/dlsu_dp.webp"); //SAMPLE LOGGED IN USER
    var user1 = new User("dijkstra_boro", hash("dijkstra_boro"), "dijkstra.boro@mail.com", "Boro","Vitek","Dijkstra","M","Food specialist. Music junkie. Reader. Professional tv fanatic. Introvert. Coffee aficionado. Bacon fan. Web advocate.","../img/dp/dijkstra_boro.webp");
    var user2 = new User("skinner_thomas",hash("skinner_thomas"),"skinner.thomas@mail.com","Thomas","Dwain","Skinner","M","Pop culture ninja. Coffee enthusiast. Evil introvert. Social media scholar. Unapologetic internet geek. Tv fan.","../img/dp/skinner_thomas.webp");
    var user3 = new User("morita_haruka",hash("morita_haruka"),"morita.haruka@mail.com","Haruka","Yuzuki","Morita","F","Incurable bacon fan. Food nerd. Award-winning social media expert. Certified zombie maven. Friendly travel geek.","../img/dp/morita_haruka.webp");
    var user4 = new User("bogomolov_natalya",hash("bogomolov_natalya"),"bogomolov.natalya@mail.com","Natalya","Yulia","Bogomolov","F","Tv expert. Extreme reader. Pop culture geek. Bacon guru. General explorer. Student. Organizer.","../img/dp/bogomolov_natalya.webp");
    users.push(user0, user1,user2,user3,user4);

    posts.push(new Post(users[1].userID, "This is a Samsung A02 Phone", "Mobiles&Gadgets", "Samsung Store via Shopee Mall", "https://shopee.ph/Samsung-Galaxy-A22-5G-i.57465664.13101179266?sp_atk=d646e37a-e2ea-46ad-bcee-96f2edf3e9d2&xptdk=d646e37a-e2ea-46ad-bcee-96f2edf3e9d2",null, "../img/post_img/42069.webp", 100, 0, [].userID, "42069", new Date(2022, 3, 29)));
    posts.push(new Post(users[3].userID, "This is a JBL Go 2 Speaker Priced at ₱199 - ₱599", "Audio", "techplus_galaxy via Shopee", "https://shopee.ph/Original-JBL-GO-2-Portable-Wireless-Bluetooth-Speaker-Waterproof-Mini-Outdoor-Speakers-Sport-Bass-i.323538985.14170356872?sp_atk=a1909e3c-6d3e-4d79-afaa-fd232505f29c&xptdk=a1909e3c-6d3e-4d79-afaa-fd232505f29c",null, "../img/post_img/12345.webp", 10, 0, [].userID, "12345", new Date(2022, 3, 20)));
    posts.push(new Post(users[4].userID, "My go-to lip balm at only P200!", "Makeup&Fragrances", "Shopee Mall", "https://shopee.ph/Stained-Glossy-Balm-Pink-i.272491104.15215744268?sp_atk=c23cad31-d0c3-4697-99a0-a6ed79eaa9c3&xptdk=c23cad31-d0c3-4697-99a0-a6ed79eaa9c3", null, "../img/post_img/08191.webp", 5, 0, [].userID, "08191", new Date(2022, 3, 18)));
    posts.push(new Post(users[2].userID, "The cutest Ghibli stickers! Only P85 each", "Hobbies&Stationery", "Pomelo Paints Co on Shopee", "https://shopee.ph/Studio-Ghibli-(Totoro)-Inspired-Vinyl-Journal-Deco-Sticker-Sheet-pomelo-paints-co.-i.6630353.14848177754?xptdk=39ee076a-4724-4298-9c09-15f27d9384b7", null, "../img/post_img/10228.webp", 20, 0, [].userID, "10228", new Date(2022, 3, 15)));
    posts.push(new Post(users[1].userID, "For P1,600, great quality and fun to use", "Mobiles&Gadgets", "ziepk shop via Shopee", "https://shopee.ph/Paperang-P1-Portable-Phone-Wireless-Connection-Paper-Printer-i.87773654.1508928633?sp_atk=405518e8-7d5e-4c01-85e0-288824bd895b&xptdk=405518e8-7d5e-4c01-85e0-288824bd895b", null, "../img/post_img/78695.webp", 3, 0, [].userID, "78695", new Date(2022, 3, 14)));
    posts.push(new Post(users[2].userID, "Ready to rock out with these Air Force 2. Best P370 spent.", "Men'sShoes", "Shopee", "https://shopee.ph/Air-Force-2-Running-Sneakers-shoes-For-Men-And-women-K55-i.49770780.4468970194?sp_atk=c11abc37-ad7e-43ed-9df0-66d1dfa4bf3c&xptdk=c11abc37-ad7e-43ed-9df0-66d1dfa4bf3c", null, "../img/post_img/16181.webp", 23, 0, [].userID, "16181", new Date(2022, 3, 12)));
    posts.push(new Post(users[3].userID, "This air fryer never disappoints. Got this for P1,300", "HomeAppliances", "electronicdigtal on Shopee", "https://shopee.ph/Air-fryer-6.5L-4.5L15L-Touch-screen-multifunction-fully-automatic-Frying-pan-kitchen-appliances-oven-i.426804848.8948486646?sp_atk=57ca0368-3045-42ac-999e-3d6a64ee4652&xptdk=57ca0368-3045-42ac-999e-3d6a64ee4652", null, "../img/post_img/16334.webp", 12, 0, [].userID, "16334", new Date(2022, 3, 10)));
    posts.push(new Post(users[4].userID, "Just in time for summer. Got this cute inflatable for just P30", "Sports&Travel", "micah.shop on Shopee", "https://shopee.ph/Spot-cartoon-single-layer-inflatable-swimming-ring-life-buoy-i.38222881.1797533401?sp_atk=4faffeab-fade-4652-9fca-1545b4356745&xptdk=4faffeab-fade-4652-9fca-1545b4356745", null, "../img/post_img/74547.webp", 8, 0, [].userID, "74547", new Date(2022, 3, 10)));
    posts.push(new Post(users[0].userID, "Get your latest Team DLSU Merch at SCHOOLSPIRIT from Shopee for just P450", "Men'sApparel", "shoolspirit on Shopee","https://shopee.ph/La-Salle-Team-DLSU-Shirt-(Unisex)-i.110479407.14750117688?sp_atk=368b0794-f747-4e2b-8edc-bd1475f1646b&xptdk=368b0794-f747-4e2b-8edc-bd1475f1646b", null, "../img/post_img/61619111.webp",1911,0,[].userID,"61619111",new Date(2021,5,19)));
    posts.push(new Post(users[0].userID, "Get your latest Green Stallions Merch at EpicClothingWear from Shopee for just P450", "Men'sApparel", "EpicClothingWear on Shopee","https://shopee.ph/DE-LA-SALLE-UNIVERSITY-SHIRT-i.58444376.1375379701", null, "../img/post_img/61619112.webp", 1911, 0, [].userID, "61619112", new Date(2020,5,19)));

    comments.push(new Comment(users[0].userID, "Hi, this is a nice speaker!", "12345",new Date()));
    comments.push(new Comment(users[2].userID, "A cheap phone, nice!", "42069",new Date()));
    comments.push(new Comment(users[1].userID, "I'd like to buy 1", "61619112",new Date()));
    comments.push(new Comment(users[2].userID, "Take my moneyyyy", "61619111",new Date()));
    comments.push(new Comment(users[3].userID, "Ahhhhhh", "61619111",new Date()));
    comments.push(new Comment(users[4].userID, "DLSU Animo Lasalle", "61619111",new Date()));
    comments.push(new Comment(users[1].userID, "Animo Lasalle", "61619112",new Date()));
    comments.push(new Comment(users[2].userID, "WHOOOOOOO Finally!!!!", "61619112",new Date()));
    comments.push(new Comment(users[2].userID, "Time to beat the summer heat for my kids!", "74547",new Date()));
    comments.push(new Comment(users[3].userID, "Mine broke after just a few uses :(", "78695", new Date()));
    comments.push(new Comment(users[2].userID, "The seller was rude when I was trying to place an order", "78695", new Date()));
    comments.push(new Comment(users[4].userID, "Just placed an order for this! TY", "16334", new Date()));
    comments.push(new Comment(users[1].userID, "Is this really better than the OG frying with oil???", "16334", new Date()));
    comments.push(new Comment(users[2].userID, "Aw man, the black one is sold out...", "16334", new Date()));

    posts = sortByDate(posts);
    console.log("Autofill complete!");
}


/*MAIN*/

var newPostClicked = false;

/*
===================================================================================

FUNCTION SPECIFIC METHODS

===================================================================================
*/

/**
 * Sorts the given list of posts by date 
 * @param {list} postList Post list to be sorted
 * @param {Boolean} descending Sorts the given postList on a descending order by default (true), set as false if otherwise.
 * @returns Sorted post list by date whether descending or ascending.
 */ 
function sortByDate(postList, descending=true){
    var sortedPosts = [];
    if(descending){
        sortedPosts = postList.sort((a, b) => (a.datetime < b.datetime) ? 1 : (a.datetime === b.datetime) ? ((a.datetime < b.datetime) ? 1 : -1) : -1 );        
    }else{
        sortedPosts = postList.sort((a, b) => (a.datetime > b.datetime) ? 1 : (a.datetime === b.datetime) ? ((a.datetime > b.datetime) ? 1 : -1) : -1 );
    }
    return sortedPosts;
}

/**
 * Simple Hash Function (for emulation purposes)
 * Reference: https://gist.github.com/iperelivskiy/4110988
 * @param {string} s String to be hashed
 * @returns Numeric hash string equivalent of s
 */
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

export default {users, posts, comments, autoFill};