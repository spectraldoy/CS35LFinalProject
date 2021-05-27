// various global items
import logo from './testlogo.png';

export const Name = "Foxtrot";
export const Logo = logo; // just so it's in one file

export async function getScheme(query, prefix="grading_schemes") {
    // fetches query from SCHEME database
    // if this ends up being useless, just copy this code wherever you need it:
    const response = await fetch("http://localhost:3001/" + prefix + "?" + query);
    return response;
}
