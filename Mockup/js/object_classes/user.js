/**
 * ======================================================================
 * 
 *                              USER JS
 *                  
 *                  THIS JS FILE CONTAINS THE OBJECT 
 *                  CONSTRUCTOR FOR USER OBJECT.
 * 
 *                  TO BE CONVERTED TO CLASS FILE IF NEEDED
 * 
 *                   YES, 'TWAS DESIGNED/WRITTEN 
 *                      IN AN OOP PARADIGM.
 * 
 * ======================================================================
 */


/**
 * User Profile or User Object
 * @param {string} username Username
 * @param {string} password Password (Refers to password_b at signup and settings)
 * @param {string} email Email
 * @param {string} fname First Name
 * @param {string} mname Middle Name
 * @param {string} lname Last Name
 * @param {string} gender Gender
 * @param {string} bio Biography
 * @param {string} profilepic ProfilePic (string? or blob? NOT YET SURE)
 * @param {Date} dateCreated Used as reference values for hashing userID. Defaults to new Date() but can be set as constant when prototyping users.
 */
 const User = function(username, password="", email, fname, mname="", lname, gender, bio="", profilepic="", dateCreated=new Date()){
    this.username = username;
    this.password = password; //acts more as a passhash than a password
    this.email = email;
    this.fname = fname;
    this.mname = mname;
    this.lname = lname;
    this.gender = gender;
    this.bio = bio;
    this.profilepic = profilepic; //TO BE UPDATED TO POINT TO SERVER DIRECTORY AT '../img/dp/<username>.jpg'; BY CURRENT DESIGN, IF USERNAME WAS CHANGED, THE DP WILL BE SAVED AGAIN AS NEW FILE WITH NEW FILENAME (I.E. USERNAME)
    this.formal_name = lname + ", " + fname + " " + mname.substring(0,1);
    this.userID = hash(this.username+dateCreated.toString); //hash() must be on the same area as User constructor; DON'T IMPLEMENT FOR PHASE 1 JUST YET

    //IF A CLASS, ADD FUNCTION TO SAVE URL/BLOB AS FILE TO SERVER AT '../img/dp/<username>.jpg'
}