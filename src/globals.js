// various global items

// logo credits to https://www.instagram.com/zuu_xzsf/
import logo from './logo.png';

export const Name = "Foxtrot";
export const Logo = logo; // just so it's in one file

export async function getItem(query, prefix="grading_schemes") {
    // fetches query from SCHEME database
    // if this ends up being useless, just copy this code wherever you need it:
    const response = await fetch("http://localhost:3001/" + prefix + "?" + query);
    return response;
}
