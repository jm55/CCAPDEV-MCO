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
 * @param {string} userID UserID of the the User of the post
 * @param {string} description Description of the Post
 * @param {string} posthash Post hash of the post
 * @param {string} category Category of Post Item
 * @param {string} label Label of product in post item
 * @param {string} link Link of product in post item
 * @param {*} imgblob Image in blob type //NULL 
 * @param {string} imgurl Image in URLtype
 * @param {Number} like Number of likes; Default: 0
 * @param {Number} report Report count //TO BE REPLACED BY A Report object
 * @param {list} comment Comment objects
 * @param {Date} datetime Date and Time of Post; Default: new Date()
 */
 const Post = function(userID, description="", 
                        category="", label="", link="", imgblob=null, imgurl="", 
                        like=0, report=0, comment=[], 
                        posthash="", datetime = new Date()){
    this.userID = userID;
    this.description = description;
    this.posthash = posthash;
    this.category = category;
    this.imgblob = imgblob;
    this.imgurl = imgurl;
    this.like = like;
    this.report = report;
    this.comment = comment;
    this.datetime = datetime;
    this.label = label;
    this.link = link;
}


/***
 * 
 * REMEMBER TO INCLUDE THIS IF POST CONSTRUCTOR IS PART OF THE JS CODE
 * 
 * 
 */

/**
 * Simple Hash Function (for emulation purposes)
 * Reference: https://gist.github.com/iperelivskiy/4110988
 * @param {string} s String to be hashed
 * @returns Numeric hash string equivalent of s
 */
 function hash(s) {
    /* Simple hash function. */
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        /*jshint plusplus:false bitwise:false*/
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a);
}