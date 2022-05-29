import { getDB } from '../conn.js';

const userCollection = getDB().collection('users');

export function checkUsers(){
    return userCollection.find({}).toArray();
}

export default{};
console.log("DB.Controller userController.js loaded");