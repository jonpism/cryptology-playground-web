/**
 * URL encoding - percent encoding
 * @param {string} input - input string.
 * @param {string} mode - 'encode' or 'decode'.
 */
export function processUrlEncode(input, mode) {
    if (!input) return "";

    if (mode === 'encode') {
        return encodeUrlPlus(input);
    } else {
        return decodeUrlPlus(input);
    }
}

function encodeUrlPlus(str) {
    // encodeURIComponent for safety.
    let encoded = encodeURIComponent(str);
    
    encoded = encoded.replace(/%20/g, '+');
    
    return encoded;
}

function decodeUrlPlus(str) {
    // decodeURIComponent doesn't treat + as space automatically.
    const cleanStr = str.replace(/\+/g, '%20');
    
    try {
        return decodeURIComponent(cleanStr);
    } catch (e) {
        throw new Error("Malformed URI sequence.");
    }
}