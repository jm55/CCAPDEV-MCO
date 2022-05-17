/**
 * ======================================================================
 * 
 *                              REPORT JS
 *                  
 *                  THIS JS FILE CONTAINS THE OBJECT 
 *                  CONSTRUCTOR FOR REPORT OBJECT.
 * 
 *                  TO BE CONVERTED TO CLASS FILE IF NEEDED
 * 
 *                   YES, 'TWAS DESIGNED/WRITTEN 
 *                      IN AN OOP PARADIGM.
 * 
 * ======================================================================
 */

/**
 * Report object that contains who reported what post and when.
 * It does not consider the 'reason' of the report.
 * The system only aims to determine if a certain post attains the report
 * threshold based on backend report frequency assessment.
 * @param {string} posthash 
 * @param {string} reporterID 
 * @param {Date} datetime 
 */
const Report = function(posthash, reporterID, datetime = new Date()){
    this.posthash = posthash;
    this.reporterID = reporterID;
    this.datetime = datetime;
}