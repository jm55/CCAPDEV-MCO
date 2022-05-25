console.log("utils.js loaded");

function sortByDate(postList, descending=true){
    var sortedPosts = [];
    if(descending){
        sortedPosts = postList.sort((a, b) => (a.datetime < b.datetime) ? 1 :(a.datetime === b.datetime) ? ((a.datetime < b.datetime) ? 1 :-1) :-1 );        
    }else{
        sortedPosts = postList.sort((a, b) => (a.datetime > b.datetime) ? 1 :(a.datetime === b.datetime) ? ((a.datetime > b.datetime) ? 1 :-1) :-1 );
    }
    return sortedPosts;
}

function appendUserToPost(){
    for(var p of posts){
        for(var u of users){
            if(p.author == u.userId){
                p['user'] = u;
            }
        }
    }
}

function appendCommentToPost(){
    var clist = [];
    for(var p of posts){
        clist = [];
        for(var c of comments){
            if(p.posthash == c.posthash){
                clist.push(c);
            }
        }
        p['comments'] = clist;
    }
}

function appendLikesToPost(){
    var filteredLikes = [];
    for(var p = 0; p < posts.length; p++){
        filteredLikes = [];
        for(var l = 0; l < likes.length; l++){
            if(posts[p].posthash == likes[l].posthash)
                filteredLikes.push(likes[l]);
        }
        posts[p]['likes'] = filteredLikes.length;
    }
}

function appendUsernameToComments(){
    var commentLength = comments.length;
    for(var i = 0; i < commentLength; i++){
        comments[i]['username'] = findUsernameByID(comments[i].author);
    }
}

function findUsernameByID(id){
    for(var u of users){
        if(u.userId == id)
            return u.username;
    }
}

function appendPostMetadata(){
    appendUsernameToComments();
    appendUserToPost();
    appendCommentToPost();
    appendLikesToPost();
}

function autoFill(){
    var user0 = {userId: '1', username:"dlsu", passhash:"237392540", email:"dlsu@mail.com", fname:"De La Salle", mname:"University", lname:"Manila", gender:"M", bio:"Animo La Salle", profilepic:"/img/dp/dlsu_dp.webp"}; //SAMPLE LOGGED IN USER
    var user1 = {userId: '2', username:"dijkstra_boro", passhash:hash("dijkstra_boro"), email:"dijkstra.boro@mail.com", fname:"Boro", mname:"Vitek", lname:"Dijkstra", gender:"M", bio:"Food specialist. Music junkie. Reader. Professional tv fanatic. Introvert. Coffee aficionado. Bacon fan. Web advocate.", profilepic:"/img/dp/dijkstra_boro.webp"};
    var user2 = {userId: '3', username:"skinner_thomas", passhash:hash("skinner_thomas"), email:"skinner.thomas@mail.com", fname:"Thomas", mname:"Dwain", lname:"Skinner", gender:"M", bio:"Pop culture ninja. Coffee enthusiast. Evil introvert. Social media scholar. Unapologetic internet geek. Tv fan.", profilepic:"/img/dp/skinner_thomas.webp"};
    var user3 = {userId: '4', username:"morita_haruka", passhash:hash("morita_haruka"), email:"morita.haruka@mail.com", fname:"Haruka", mname:"Yuzuki", lname:"Morita", gender:"F", bio:"Incurable bacon fan. Food nerd. Award-winning social media expert. Certified zombie maven. Friendly travel geek.", profilepic:"/img/dp/morita_haruka.webp"};
    var user4 = {userId: '5', username:"bogomolov_natalya", passhash:hash("bogomolov_natalya"), email:"bogomolov.natalya@mail.com", fname:"Natalya", mname:"Yulia", lname:"Bogomolov", gender:"F", bio:"Tv expert. Extreme reader. Pop culture geek. Bacon guru. General explorer. Student. Organizer.", profilepic:"/img/dp/bogomolov_natalya.webp"};
    users.push(user0, user1, user2, user3, user4);

    //Post Structure: {author, description, category, label, link, imgurl, posthash, datetime, user, likes, comments}, though user, likes, comments will be appended later
    var post1 = {author:users[1].userId, description:"This is a Samsung A02 Phone", category:"Mobiles & Gadgets", label:"Samsung Store via Shopee Mall", link:"https://shopee.ph/Samsung-Galaxy-A22-5G-i.57465664.13101179266?sp_atk=d646e37a-e2ea-46ad-bcee-96f2edf3e9d2 & xptdk=d646e37a-e2ea-46ad-bcee-96f2edf3e9d2", imgurl:"/img/post_img/42069.webp", posthash:"42069", datetime:new Date(2022, 3, 29)};
    var post2 = {author:users[3].userId, description:"This is a JBL Go 2 Speaker Priced at ₱199 - ₱599", category:"Audio", label:"techplus_galaxy via Shopee", link:"https://shopee.ph/Original-JBL-GO-2-Portable-Wireless-Bluetooth-Speaker-Waterproof-Mini-Outdoor-Speakers-Sport-Bass-i.323538985.14170356872?sp_atk=a1909e3c-6d3e-4d79-afaa-fd232505f29c & xptdk=a1909e3c-6d3e-4d79-afaa-fd232505f29c", imgurl:"/img/post_img/12345.webp", posthash:"12345", datetime:new Date(2022, 3, 20)};
    var post3 = {author:users[4].userId, description:"My go-to lip balm at only P200!", category:"Makeup & Fragrances", label:"Shopee Mall", link:"https://shopee.ph/Stained-Glossy-Balm-Pink-i.272491104.15215744268?sp_atk=c23cad31-d0c3-4697-99a0-a6ed79eaa9c3 & xptdk=c23cad31-d0c3-4697-99a0-a6ed79eaa9c3", imgurl:"/img/post_img/08191.webp", posthash:"08191", datetime:new Date(2022, 3, 18)};
    var post4 = {author:users[2].userId, description:"The cutest Ghibli stickers! Only P85 each", category:"Hobbies & Stationery", label:"Pomelo Paints Co on Shopee", link:"https://shopee.ph/Studio-Ghibli-(Totoro)-Inspired-Vinyl-Journal-Deco-Sticker-Sheet-pomelo-paints-co.-i.6630353.14848177754?xptdk=39ee076a-4724-4298-9c09-15f27d9384b7", imgurl:"/img/post_img/10228.webp",  posthash:"10228", datetime:new Date(2022, 3, 15)};
    var post5 = {author:users[1].userId, description:"For P1, 600, great quality and fun to use", category:"Mobiles & Gadgets", label:"ziepk shop via Shopee", link:"https://shopee.ph/Paperang-P1-Portable-Phone-Wireless-Connection-Paper-Printer-i.87773654.1508928633?sp_atk=405518e8-7d5e-4c01-85e0-288824bd895b & xptdk=405518e8-7d5e-4c01-85e0-288824bd895b", imgurl:"/img/post_img/78695.webp",  posthash:"78695", datetime:new Date(2022, 3, 14)};
    var post6 = {author:users[2].userId, description:"Ready to rock out with these Air Force 2. Best P370 spent.", category:"Men's Shoes", label:"Shopee", link:"https://shopee.ph/Air-Force-2-Running-Sneakers-shoes-For-Men-And-women-K55-i.49770780.4468970194?sp_atk=c11abc37-ad7e-43ed-9df0-66d1dfa4bf3c & xptdk=c11abc37-ad7e-43ed-9df0-66d1dfa4bf3c", imgurl:"/img/post_img/16181.webp",  posthash:"16181", datetime:new Date(2022, 3, 12)};
    var post7 = {author:users[3].userId, description:"This air fryer never disappoints. Got this for P1, 300", category:"HomeAppliances", label:"electronicdigtal on Shopee", link:"https://shopee.ph/Air-fryer-6.5L-4.5L15L-Touch-screen-multifunction-fully-automatic-Frying-pan-kitchen-appliances-oven-i.426804848.8948486646?sp_atk=57ca0368-3045-42ac-999e-3d6a64ee4652 & xptdk=57ca0368-3045-42ac-999e-3d6a64ee4652", imgurl:"/img/post_img/16334.webp", posthash:"16334", datetime:new Date(2022, 3, 10)};
    var post8 = {author:users[4].userId, description:"Just in time for summer. Got this cute inflatable for just P30", category:"Sports & Travel", label:"micah.shop on Shopee", link:"https://shopee.ph/Spot-cartoon-single-layer-inflatable-swimming-ring-life-buoy-i.38222881.1797533401?sp_atk=4faffeab-fade-4652-9fca-1545b4356745 & xptdk=4faffeab-fade-4652-9fca-1545b4356745", imgurl:"/img/post_img/74547.webp", posthash:"74547", datetime:new Date(2022, 3, 10)};
    var post9 = {author:users[0].userId, description:"Get your latest Team DLSU Merch at SCHOOLSPIRIT from Shopee for just P450", category: "Men's Apparel", label:"shoolspirit on Shopee", link:"https://shopee.ph/La-Salle-Team-DLSU-Shirt-(Unisex)-i.110479407.14750117688?sp_atk=368b0794-f747-4e2b-8edc-bd1475f1646b & xptdk=368b0794-f747-4e2b-8edc-bd1475f1646b", imgurl:"/img/post_img/61619111.webp", posthash:"61619111", datetime:new Date(2021, 5, 19)};
    var post10 = {author:users[0].userId, description:"Get your latest Green Stallions Merch at EpicClothingWear from Shopee for just P450", category:"Men's Apparel", label:"EpicClothingWear on Shopee", link:"https://shopee.ph/DE-LA-SALLE-UNIVERSITY-SHIRT-i.58444376.1375379701", imgurl:"/img/post_img/61619112.webp", posthash:"61619112", datetime:new Date(2020, 5, 19)};
    posts.push(post1,post2,post3,post4,post5,post6,post7,post8,post9,post10);

    //Comment Structure: {author, text, posthash, datetime, username}, though username will be appended later
    var comment1 = {author:users[0].userId, text:"Hi, this is a nice speaker!", posthash:"12345", datetime:new Date()};
    var comment2 = {author:users[2].userId, text:"A cheap phone, nice!", posthash:"42069", datetime:new Date()};
    var comment3 = {author:users[1].userId, text:"I'd like to buy 1", posthash:"61619112", datetime:new Date()};
    var comment4 = {author:users[2].userId, text:"Take my moneyyyy", posthash:"61619111", datetime:new Date()};
    var comment5 = {author:users[3].userId, text:"Ahhhhhh", posthash:"61619111", datetime:new Date()};
    var comment6 = {author:users[4].userId, text:"DLSU Animo Lasalle", posthash:"61619111", datetime:new Date()};
    var comment7 = {author:users[1].userId, text:"Animo Lasalle", posthash:"61619112", datetime:new Date()};
    var comment8 = {author:users[2].userId, text:"WHOOOOOOO Finally!!!!", posthash:"61619112", datetime:new Date()};
    var comment9 = {author:users[2].userId, text:"Time to beat the summer heat for my kids!", posthash:"74547", datetime:new Date()};
    var comment10 = {author:users[3].userId, text:"Mine broke after just a few uses :(", posthash:"78695", datetime:new Date()};
    var comment11 = {author:users[2].userId, text:"The seller was rude when I was trying to place an order", posthash:"78695", datetime:new Date()};
    var comment12 = {author:users[4].userId, text:"Just placed an order for this! TY", posthash:"16334", datetime:new Date()};
    var comment13 = {author:users[1].userId, text:"Is this really better than the OG frying with oil???", posthash:"16334", datetime:new Date()};
    var comment14 = {author:users[2].userId, text:"Aw man, the black one is sold out...", posthash:"16334", datetime:new Date()};
    comments.push(comment1,comment2,comment3,comment4,comment5,comment6,comment7,comment8,comment9,comment10,comment11,comment12,comment13,comment14);

    //automated nalang para mabilis
    //Like structure: {author, posthash}
    for(var u of users){
        for(var p of posts){
            if(u.userId != p.author)
                likes.push({author: u.userId, posthash: p.posthash});
        }
    }
    likes.push({author: user0.userId, posthash: post1.posthash});

    posts = sortByDate(posts);
    
    appendPostMetadata();
}

export var users = [];
export var posts = [];
export var comments = [];
export var likes = [];

autoFill();

export var currentUser = users[0];
export var targetUser = users[1];
export var currentPost = posts[9];

export function getCommentToPost(posthash){
    var comments = [];
    for(var c of comments){
        if(c.posthash == posthash)
            comments.push(c);
    }
    return comments;
}

export function getPostsByAuthorID(id){
    var filteredPosts = [];
    for(var p of posts){
        if(p.author === id)
            filteredPosts.push(p);
    }
    return filteredPosts;
}

export function hash(s){
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

export default {};