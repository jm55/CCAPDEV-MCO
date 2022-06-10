import { getDB } from '../conn.js';

const userCollection = getDB().collection('users');

/**
 * Adds a user object to the user collection of the database.
 * @param {Object} user User object to be added on the database.
 * @returns Promise of an insert result on the users collection of the database.
 */
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
    return userCollection.insertOne(user);
}

/**
 * Updates a user document on the users collection of the database.
 * It uses the user's userId as the 'primary' key.
 * @param {Object} user User to be updated in the object.
 * @returns Promise of an update result on the users collection of the database.
 */
export function updateUser(user){
    //Remove the unnecessary password fields
    delete user.password_a;
    delete user.password_b;
    delete user.password_current;

    //Update the current user pointed by the userId
    return userCollection.updateOne({'userId':user.userId}, {$set: user}).catch((error)=>{
        console.error(error);
    });
}

/**
 * Gets the passhash of the user specified by the userId.
 * @param {String} userId Filter parameter 
 * @returns Promise of an array of users that fits the userId filter.
 */
export function getHash(userId){
    return userCollection.find({'userId': String(userId)},{projection: {'passhash': 1}}).toArray(); //Find passhash of user pointed by userId.
}

/**
 * Gets the passhash of the user specified by the username.
 * @param {String} username Filter parameter
 * @returns Promise of an array of users that fits the username filter.
 */
export function getHashViaUsername(username){
    return userCollection.find({'username': String(username)},{projection: {'passhash': 1}}).toArray(); //Find passhash of user pointed by username.
}

/**
 * Deletes a user specified by the userId.
 * @param {String} userId userId of the target user to be deleted.
 * @returns Promise of a delete result on the users collection of the database.
 */
export function deleteUser(userId){
    return userCollection.deleteOne({'userId': String(userId)}); //Delete user pointed by userId
}

/**
 * Finds a user that fits the specified username parameter.
 * @param {String} username username of the target user to find.
 * @param {import('mongodb').FindOptions} options Filter options
 * @returns Promise of a single user document of the specified username filter. Contains _id, username, and passhash.
 */
export function userExists(username, options=null){
    if(options!=null)
        return userCollection.findOne({username: username},options); //Find user without options
    return userCollection.findOne({username: username},{projection: {'username': 1}}); //Find user with options
}

/**
 * Gets all documents from the users collection of the database.
 * @returns Promise of a list of all users from the database.
 */
export function getUsers(options=null){
    if(options != null)
        return userCollection.find(options).toArray();
    return userCollection.find({}).toArray();
}

/**
 * Gets a user object given the specified username.
 * @param {String} userName Filter parameter
 * @param {import('mongodb').FindOptions} options Filter options
 * @returns Promise of a single user document of the specified username filter.
 */
export function getUserByUserName(userName, options=null){
    if(options != null)
        return userCollection.findOne({'username':userName}, options);
    return userCollection.findOne({'username':userName});
}

/**
 * Gets a user object given the specified userId
 * @param {String} userId Filter parameter.
 * @param {import('mongodb').FindOptions} options Filter options
 * @returns Promise of a single user docuemnt of the specified userId filter.
 */
export function getUserByUserID(userId, options=null){
    if(options != null)
        return userCollection.findOne({'userId':userId}, options);
    return userCollection.findOne({'userId':userId});
}

console.log("DB.Controller userController.js loaded");