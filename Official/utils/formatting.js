export function pluralInator(word, val){
    if(val > 1)
        return word + 's';
    return word;
}

export function simpleDateTime(dt){
    return dt.toLocaleDateString();
}

export function formalName(fname, mname, lname){
    return lname + ", " + fname + " " + mname.substring(0,1) + ".";
}