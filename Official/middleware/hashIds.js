import Hashids from 'hashids'
import crypto from 'crypto-random-string';
const postHash = new Hashids("8uDolF!Nd5_post",10,"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
const userId = new Hashids("8uDolF!Nd5_userId",10,"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");

/**
 * Creates a hash for userId
 * @returns New hex value for post with length 8
 */
export function newUserId(){
    return userId.encodeHex(crypto({length: 8}));
}

/**
 * Creates a hash for postHash
 * @returns New hash for post with length 10
 */
export function newPostHash(){
    return postHash.encodeHex(crypto({length: 16}));
}

export default {}
console.log("Middleware: hashids.js loaded!");