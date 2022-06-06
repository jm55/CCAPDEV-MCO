import * as dispatch from './dispatch.js';

export function getCookieUserId(cookies){
    if(cookies.budolfinds != null)
        return String(cookies.budolfinds);
    return null
}

console.log("Middleware: cookie.js loaded!");