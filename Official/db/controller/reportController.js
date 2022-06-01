import { getDB } from '../conn.js';

const reportCollection = getDB().collection('reports');

export function checkReports(){
    return reportCollection.find({}).toArray();
}

export function blotterReport(report){
    return reportCollection.insertOne(report);
}

export function reportByPostOwnerId(userId){
    return reportCollection.find({'postOwnerId':userId}).toArray();
}

console.log("DB.Controller reportController.js loaded");