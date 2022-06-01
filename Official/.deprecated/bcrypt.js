/**
 * DO NOT USE THIS JS FILE.
 * ALL CRYPTOGRAPHIC AND HASHING FUNCTIONS ARE HANDLED BY bcrypt AND hashIds.js RESPECTIVELY.
 * @deprecated June 1, 2022
 */

// export function getHash(val){   //UPDATE WITH SOMETHING THAT USES BCRYPT
//     return hash(val);
// }

// export function hash(s){
//     /* Simple hash function. */
//     var a = 1, c = 0, h, o;
//     if (s) {
//         a = 0;
//         /*jshint plusplus:false bitwise:false*/
//         for (h = s.length - 1; h >= 0; h--) {
//             o = s.charCodeAt(h);
//             a = (a<<6&268435455) + o + (o<<14);
//             c = a & 266338304;
//             a = c!==0?a^c>>21:a;
//         }
//     }
//     return String(a);
// }

// export default {};
// console.log("Middleware: hasher.js loaded!");