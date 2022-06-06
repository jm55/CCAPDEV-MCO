import * as dispatch from './dispatch.js';

export function getCookieUserId(cookies){
    if(cookies.userId != null)
        return String(cookies.userId);
    return null
}

console.log("Middleware: cookie.js loaded!");