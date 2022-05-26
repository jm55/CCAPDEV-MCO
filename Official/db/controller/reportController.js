import { getDB } from '../conn.js';

const reportCollection = getDB().collection('reports');

export function checkReports(){
    return reportCollection.find({}).toArray();
}

export default{};
console.log("Module reportController.js loaded");