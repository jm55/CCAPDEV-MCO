import { getDB } from '../conn.js';

const reportCollection = getDB().collection('reports');

/**
 * Adds a report to the reports collection of the database.
 * @param {Object} report Report object to be added.
 * @returns Promise of an insert on reports collection of the database.
 */
export function blotterReport(report){
    return reportCollection.insertOne(report);
}

/**
 * Gets all reports associated with the specified user through the specified userId.
 * @param {String} userId Specified owner of the posts with reports.
 * @param {import('mongodb').FindOptions} options Filter options.
 * @returns Promise of an array of reports from the database.
 */
export function reportByPostOwnerId(userId, options=null){
    if(options!=null)
        return reportCollection.find({'postOwnerId':userId}, options).toArray();
    return reportCollection.find({'postOwnerId':userId}).toArray();
}

/**
 * Deletes all reports created by user as specified by userId.
 * @param {String} userId User that created the reports
 * @returns Promise result of the deletion on reports collection of the database.
 */
export function deleteByUserID(userId){
    return reportCollection.deleteMany({'userId':userId});
}

console.log("DB.Controller reportController.js loaded");