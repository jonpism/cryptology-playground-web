/**
 * converts text characters to Unicode Codepoints (U+XXXX) and vice-versa.
 * @param {string} input - input string.
 * @param {string} mode - 'char2cp' or 'cp2char'
 */
export function processCodepoint(input, mode) {
    if (!input || !input.trim()) return "";

    if (mode === 'char2cp') {
        return textToCodepoint(input);
    } else {
        return codepointToText(input);
    }
}

/**
 * Text to Unicode Codepoints
 */
function textToCodepoint(text) {
    const chars = Array.from(text);
    
    return chars.map(char => {
        // codePointAt(0) returns the decimal integer of the unicode character
        const code = char.codePointAt(0);
        
        // convert to Hex uppercase, ensure at least 4 digits
        let hex = code.toString(16).toUpperCase();
        if (hex.length < 4) {
            hex = hex.padStart(4, '0');
        }
        
        return `U+${hex}`;
    }).join(" ");
}

/**
 * Unicode Codepoints to Text
 */
function codepointToText(input) {
    // split by spaces to handle multiple characters
    const parts = input.trim().split(/\s+/);
    
    return parts.map(part => {
        // remove "U+" or "u+" prefix if present
        const cleanHex = part.replace(/^U\+/i, "");
        
        if (!/^[0-9A-Fa-f]+$/.test(cleanHex)) {
            throw new Error(`Invalid codepoint format: "${part}"`);
        }

        // parse Hex to Integer
        const code = parseInt(cleanHex, 16);

        // Validate Unicode Range (0 to 0x10FFFF)
        if (code > 0x10FFFF) {
            throw new Error(`Codepoint out of range: "${part}"`);
        }

        try {
            // convert back to character
            return String.fromCodePoint(code);
        } catch (e) {
            throw new Error(`Invalid codepoint: "${part}"`);
        }
    }).join("");
}