/**
 * A1Z26 Cipher (Letter Number Cipher)
 * A=1, B=2, ..., Z=26
 *
 * @param {string} input - input string (text or numbers).
 * @param {string} mode - 'encode' (text -> numbers) or 'decode' (numbers -> text).
 */

export function processA1Z26(input, mode) {
    if (!input || !input.trim()) return "";

    if (mode === 'encode') {
        return encode(input);
    } else {
        return decode(input);
    }
}

/**
 * encodes text -> numbers (1-26)
 */
function encode(text) {
    const result = [];
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const code = char.toUpperCase().charCodeAt(0);

        // check if character is A-Z (ASCII 65-90)
        if (code >= 65 && code <= 90) {
            const number = code - 64; // A(65) - 64 = 1
            result.push(number);
        } else {
            // append the char directly
            if (char.trim() !== '') {
                result.push(char);
            }
        }
    }
    
    // if result has items, and the last item was a number, 
    // the join(" ") later will add a space. 
    return result.join(" ");
}

/**
 * decodes numbers -> text
 * "1 2 3", "1, 2, 3", "1-2-3"
 */
function decode(input) {
    // split by any non-digit character to be flexible
    const tokens = input.trim().split(/[\s,.-]+/);

    let result = "";

    for (const token of tokens) {
        if (!token) continue;

        const num = parseInt(token, 10);

        // check if it is a valid 1-26 number
        if (!isNaN(num) && num >= 1 && num <= 26) {
            // convert back to ASCII: 1 + 64 = 65 ('A')
            result += String.fromCharCode(num + 64);
        } else {
            // if it is not a number or it is our of range
            result += "?";
        }
    }

    return result;
}