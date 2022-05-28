import { MongoClient } from 'MongoDB';

//Connection URL
const connectionString = process.env.MONGODB_URI
const client = new MongoClient(connectionString);

export function connectToServer(callback){
    client.connect((err,client)=>{
        if(err || !client)
            return callback(err);
        console.log("Connection to DB established!");
        return callback();
    });
}

export function getDB(name = process.env.DB_NAME){
    return client.db(name);
}

const dbNames = ['users','reports','comments','posts','likes'];

export function checkDB(){
    getDB().stats().then((s)=>{
        console.log("Servername: " + getDB().databaseName);
        console.log("DB Collections: " + s.collections);
    });
}

export default {};
console.log("Module conn.js loaded!");