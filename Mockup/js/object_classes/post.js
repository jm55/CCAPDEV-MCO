/**
 * ======================================================================
 * 
 *                              POST JS
 *                  
 *                  THIS JS FILE CONTAINS THE OBJECT 
 *                  CONSTRUCTOR FOR POST OBJECT.
 * 
 *                  TO BE CONVERTED TO CLASS FILE IF NEEDED
 * 
 *                   YES, 'TWAS DESIGNED/WRITTEN 
 *                      IN AN OOP PARADIGM.
 * 
 * ======================================================================
 */

/**
 * Post Object
 * @param {*} user User of the Post 
 * @param {*} description Description of the Post
 * @param {*} category Category of Post Item
 * @param {*} imgblob Image in blob type
 * @param {*} imgurl Image in URLtype
 * @param {*} like Number of likes; Default: 0
 * @param {*} report Report objects (Can be converted to report counts if needed)
 * @param {*} comment Comment objects
 * @param {*} posthash Post hash (identifier for post)
 * @param {*} postid  Post ID
 * @param {*} datetime Date and Time of Post; Default: new Date()
 */
const Post = function(user, description="", 
                    category="", imgblob=null, imgurl="", 
                    like=0, report=[], comment=[], 
                    posthash="", postid=-1, datetime = new Date()){
    this.user = user;
    this.description = description;
    this.category = category;
    this.imgblob = blob;
    this.imgurl = url;
    this.like = like;
    this.report = report;
    this.comment = comment;
    this.posthash = posthash;
    this.postid = postid;
    this.datetime = datetime;
}