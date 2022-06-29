import {getReasonPhrase} from 'http-status-codes';

export function redirectError(res, errorCode){
    res.render("err", {
        title: "Error - Budol Finds",
        errID: errorCode,
        errMsg: getReasonPhrase(errorCode),
    });
}