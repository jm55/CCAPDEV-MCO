import * as mongodb from 'mongodb';
import fs from 'fs';
import 'dotenv/config';

const client = new mongodb.MongoClient(process.env.MONGODB_URI);

function connectToMongo(callback){
    try{
        client.connect((err, client)=>{
            if(err || !client)
                return callback(err);
            return callback(err);
        });
    }catch{
        console.error("Error occured while connecting to server.");
        process.exit(0);
    };
    
}

function getDB(dbName){
    return client.db(dbName);
}


async function addData(db){
    console.log('Adding collection list to db...');
    //CREATE COLLECTION
    //@ts-ignore
    const list = ['users', 'posts', 'comments', 'reports', 'likes'];
    var counter = 0;
    for(var l of list){
        db.createCollection(String(l)).then(result=>{
            if(result != null)
                counter++;
            if(counter == list.length){
                console.log('Minimal data installation completed!')
                client.close();
                process.exit();
            }
        }).catch((error)=>{
            console.error(error);
        });
    }
    
}

connectToMongo((err, callback)=>{
    if(err){
        console.error(err);
        console.log('Exiting...');
        process.exit;
    }
    const DBNAME = process.env.DB_NAME;

    const db = getDB(DBNAME);
    console.log('Adding collections to database: ' + DBNAME);
    
    addData(db);
});