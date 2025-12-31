/**
 * Quoted-Printable encoding/decoding
 * @param {string} input - input string.
 * @param {string} mode - 'encode' or 'decode'.
 */
export function processQuotedPrintable(input, mode) {
    if (!input) return "";

    if (mode === 'encode') {
        return encodeQP(input);
    } else {
        return decodeQP(input);
    }
}

 // max line length: 76 characters.
function encodeQP(str) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    
    let encoded = "";
    
    // byte by byte
    for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        
        // check if character is "safe" (33-126 decimal, excluding '=')
        // RFC says: '=' (61) must be encoded.
        const isSafe = (b >= 33 && b <= 126 && b !== 61);
        
        // space (32) and tab (9): generally safe, 
        const isWhitespace = (b === 32 || b === 9);

        if (isSafe || isWhitespace) {
            encoded += String.fromCharCode(b);
        } else {
            encoded += "=" + b.toString(16).toUpperCase().padStart(2, "0");
        }
    }

    // wrap lines at 76 chars
    return softWrap(encoded, 76);
}

function decodeQP(str) {
    // remove "Soft Line Breaks" (an '=' at the very end of a line)
    let cleanStr = str.replace(/=\r?\n/g, "");

    const bytes = [];
    
    for (let i = 0; i < cleanStr.length; i++) {
        const char = cleanStr[i];
        
        if (char === '=') {
            // check if next 2 chars are valid Hex
            const hex = cleanStr.substr(i + 1, 2);
            if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
                bytes.push(parseInt(hex, 16));
                i += 2; // skip next 2 chars
            } else {
                // invalid: treat as literal '='
                bytes.push(61); 
            }
        } else {
            bytes.push(char.charCodeAt(0));
        }
    }

    const decoder = new TextDecoder("utf-8");
    return decoder.decode(new Uint8Array(bytes));
}

function softWrap(text, maxWidth) {
    let result = "";
    let currentLineLen = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // if adding this char exceeds width
        if (currentLineLen >= maxWidth - 1) {
            result += "=\n";
            currentLineLen = 0;
        }
        
        result += char;
        currentLineLen++;
        
        if (char === '\n') currentLineLen = 0;
    }
    
    return result;
}