import { getDB } from '../conn.js';

const reportCollection = getDB().collection('reports');

export function checkReports(){
    return reportCollection.find({}).toArray();
}

export function blotterReport(report){
    return reportCollection.insertOne(report);
}

console.log("DB.Controller reportController.js loaded");