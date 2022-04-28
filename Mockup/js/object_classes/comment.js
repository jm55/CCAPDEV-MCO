/**
 * ======================================================================
 * 
 *                              COMMENT JS
 *                  
 *                  THIS JS FILE CONTAINS THE OBJECT 
 *                  CONSTRUCTOR FOR COMMENT OBJECT.
 * 
 *                  TO BE CONVERTED TO CLASS FILE IF NEEDED
 * 
 *                   YES, 'TWAS DESIGNED/WRITTEN 
 *                      IN AN OOP PARADIGM.
 * 
 * ======================================================================
 */

/**
 * 
 * @param {*} user 
 * @param {*} comment_text 
 * @param {*} timedate 
 */
const Comment = function(user, comment_text, timedate=new Date()){
    this.user = user;
    this.comment_text = comment_text;
    this.datetime = timedate;
}