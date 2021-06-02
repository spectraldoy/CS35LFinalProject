// various global items

// logo credits to https://www.instagram.com/zuu_xzsf/
import logo from '../images/logo.png';

export const Name = "Foxtrot";
export const Logo = logo; // just so it's in one file

export async function getItem(query, prefix="grading_schemes") {
    // fetches query from SCHEME database
    // if this ends up being useless, just copy this code wherever you need it:
    const response = await fetch("http://localhost:3001/" + prefix + "?" + query);
    return response;
}

// taken from Michael Martin-Smucker's answer at https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript/25352300#25352300
export function isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
        }
    }
    return true;
};
