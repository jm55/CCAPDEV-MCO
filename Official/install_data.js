import * as mongodb from 'mongodb';
import fs from 'fs';
import 'dotenv/config';

const client = new mongodb.MongoClient(process.env.MONGODB_URI);

function connectToMongo(callback){
    client.connect((err, client)=>{
        if(err || !client)
            return callback(err);
        return callback(err);
    });
}

function getDB(dbName){
    return client.db(dbName);
}

var counter = 0;
const list = ['users', 'posts', 'comments', 'reports', 'likes'];

/**
 * 
 * @param {mongodb.Db} db 
 * @param {String} name 
 */
async function addData(db, name){
    console.log('Adding ' + name + ' data to db...');
    //CREATE COLLECTION
    //@ts-ignore
    db.createCollection(name).then(collection=>{
        if(collection != null)
            console.log('Collection ' + name + ' created!');
    }).catch(error=>{
        console.error('Error occured while adding ' + name + ':');
        console.error(error);
        return;
    });

    //READ DATA
    let raw = fs.readFileSync('./.installation/' + name + '.json');
    let json = JSON.parse(String(raw));
    //delete json._id;
    for(var i = 0; i < json.length; i++){
        var oid = json[i]['_id']['$oid'];
        json[i]['_id'] = new mongodb.ObjectId(String(oid));
    }
    //ADD DATA
    var collection = db.collection(name);
    if(collection){
        await collection.insertMany(json).then((result)=>{
            counter++;
            console.log('Collection ' + name + ' acknowledged: ' + result.acknowledged + ' @ ' + result.insertedCount + ' documents inserted');
            if(counter == list.length){
                console.log('Full data installation completed!')
                client.close();
                process.exit();
            }
        });
    }else{
        console.log('Collection ' + name + ' is null');
    }

}

connectToMongo((err, callback)=>{
    if(err){
        console.error(err);
        console.log('Exiting...');
        process.exit();
    }
    const DBNAME = process.env.DB_NAME;

    const db = getDB(DBNAME);
    console.log('Adding contents to database: ' + DBNAME);
    
    for(var l of list)
        addData(db, l);
});