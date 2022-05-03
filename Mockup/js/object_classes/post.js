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
 * @param {User} user Username of the postee
 * @param {string} description Description of the Post
 * @param {string} category Category of Post Item
 * @param {string} label Label of product in post item
 * @param {string} link Link of product in post item
 * @param {*} imgblob Image in blob type
 * @param {string} imgurl Image in URLtype
 * @param {Number} like Number of likes; Default: 0
 * @param {Number} report Report count
 * @param {list} comment Comment objects
 * @param {string} posthash Post hash (identifier for post)
 * @param {string} postid  Post ID
 * @param {Date} datetime Date and Time of Post; Default: new Date()
 */
 const Post = function(user, description="", 
                        category="", label="", link="", imgblob=null, imgurl="", 
                        like=0, report=0, comment=[], 
                        posthash="", postid=-1, datetime = new Date()){
    this.user = user; //to be replaced by userID
    this.description = description;
    this.category = category;
    this.imgblob = imgblob;
    this.imgurl = imgurl;
    this.like = like;
    this.report = report;
    this.comment = comment;
    this.posthash = posthash;
    this.postid = postid;
    this.datetime = datetime;
    this.label = label;
    this.link = link;
}