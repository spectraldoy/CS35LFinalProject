// functionality we need to share across different windows / displays can be put in this file
// if it only appears in 1 file in the end, then we should delete this.

export async function getScheme(query) {
    // fetches query from SCHEME database
    // if this ends up being useless, just copy this code wherever you need it:
    const response = await fetch("http://localhost:3001/get_scheme?" + query);
    return response;
}
