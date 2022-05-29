import { MongoClient } from 'MongoDB';

//Connection URL
const connectionString = process.env.MONGODB_URI
const client = new MongoClient(connectionString);

export function connectToServer(callback){
    client.connect((err,client)=>{
        if(err || !client)
            return callback(err);
        console.log("conn.connectToServer: Connection to DB established!");
        return callback();
    });
}

export function getDB(name = process.env.DB_NAME){
    return client.db(name);
}

const dbNames = ['users','reports','comments','posts','likes'];

export function checkDB(){
    getDB().stats().then((s)=>{
        console.log("DB Server Name: " + getDB().databaseName);
        console.log("DB Collections: " + s.collections);
    });
}

export default {};
console.log("DB: conn.js loaded!");