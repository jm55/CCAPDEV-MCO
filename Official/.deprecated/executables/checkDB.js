//.dotenv
import 'dotenv/config';

import * as conn from '../../db/conn.js';

conn.connectToServer((err)=>{
    if(err){
        console.error(err);
        process.exit;
    }else{
        const userCollection = conn.getDB().collection('users');    
        const findUsers = userCollection.find();
        findUsers.toArray().then((arr)=>{
            console.log("Users found!");
            console.log(arr);
        });
    }
});
