import { MongoClient } from 'MongoDB';
import mongoose from 'mongoose';

//Connection URL
const connectionString = process.env.MONGODB_URI
const client = new MongoClient(connectionString);

/**
 * Connects to the MongoDb specified in the dotenv file.
 * @param {import('MongoDB').Callback} callback 
 */
export function connectToServer(callback){
    client.connect((err,client)=>{
        if(err || !client)
            return callback(err);
        console.log("conn.connectToServer: Connection to DB established!");
        return callback();
    });
}

export const connectMongoose = () => {
    mongoose.connect(process.env.MONGOOSE_URI).then(()=>{
        console.log('conn.connectMongoose: Connection to DB established!');
    }).catch(error=>{
        console.error('Failed to connect to MongoDB!');
        console.error(error);
        process.abort();
    });
}

/**
 * Gets the DB and returns it as client's DB.
 * Specified either explicitly or implicitly as the DB name specified in 
 * the dotenv file.
 * @param {String} name Name of the database in MongoDB 
 * @returns MongoClient with the DB specified.
 */
export function getDB(name = process.env.DB_NAME){
    return client.db(name);
}

/**
 * Checks the DB if it exists.
 */
export async function checkDB(){
    return getDB().stats();
}

export default {};
console.log("DB: conn.js loaded!");