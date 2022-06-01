import { getDB } from '../conn.js';

const userCollection = getDB().collection('users');

export function checkUsers(){
    return userCollection.find({}).toArray();
}

export function addUser(user){
    /**
     * SAMPLE USER DATA
     * {    OK "username":"towasenpai",
     *      "password_a":null,
     *      "password_b":null,
     *      OK "email":"towa@hololive.com",
     *      OK "fname":"Towa",
     *      OK "mname":"_",
     *      OK "lname":"Senpai",
     *      OK "gender":"F",
     *      OK "bio":"Towa Senpai Desu",
     *      OK "passhash":"$2b$10$41/DW/Hh6tbyjpPjKcPcretAMeXZCjgJ4MKS2V5bTYfqaT6m4wov6",
     *      OK "userId":"4YVDQXqe29",
     *      OK "profilepic":"/img/dp/4YVDQXqe29.webp"}
     */
    delete user.password_a; //REMOVES PASSWORD A (NOT TO USE)
    delete user.password_b; //REMOVES PASSWORD B (NOT TO USE)
    //console.log(user);
    return userCollection.insertOne(user);
}

export function updateUser(user){
    delete user.password_a;
    delete user.password_b;
    delete user.password_current;
    console.log(user);
    return userCollection.updateOne({'userId':user.userId}, {$set: user}).then(val=>{
        console.log(val);
    }).catch((error)=>{
        console.error(error);
    });
}

export function getHash(userId){
    return userCollection.find({'userId': String(userId)}).toArray();
}

export function getHashViaUsername(username){
    return userCollection.find({'username': String(username)}).toArray();
}

export function deleteUser(userId){
    return userCollection.deleteOne({'userId': String(userId)});
}

export function userExists(username){
    return userCollection.findOne({username: username});
}

export function getUsers(){
    return userCollection.find({}).toArray();
}

export function getUsersByUserName(userName){
    return userCollection.find({'username':userName}).toArray();
}

export function getUsersByUserID(userId){
    return userCollection.find({'userId':userId}).toArray();
}

console.log("DB.Controller userController.js loaded");