/**
 * NATO Phonetic Alphabet Dictionary
 */
const NATO_MAP = {
    'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo',
    'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliett',
    'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar',
    'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
    'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee',
    'Z': 'Zulu',
    '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
    '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
};

const REVERSE_MAP = Object.entries(NATO_MAP).reduce((acc, [char, word]) => {
    acc[word.toUpperCase()] = char;
    return acc;
}, {});

/**
 * Text to NATO Phonetic conversion.
 * @param {string} input - input string.
 * @param {string} mode - 'text2nato' or 'nato2text'.
 */
export function processNato(input, mode) {
    if (!input || !input.trim()) return "";

    if (mode === 'text2nato') {
        return textToNato(input);
    } else {
        return natoToText(input);
    }
}

function textToNato(text) {
    // character by character
    const chars = Array.from(text);
    
    const result = chars.map(char => {
        const upper = char.toUpperCase();
        // if it's a known char, return the NATO word
        if (NATO_MAP[upper]) {
            return NATO_MAP[upper];
        }
        // if it's a space, return a clear spacer
        if (/\s/.test(char)) {
            return "(space)";
        }
        return char;
    });

    return result.join(" ");
}

function natoToText(natoStr) {
    // split by whitespace to get words
    const tokens = natoStr.trim().split(/\s+/);

    const result = tokens.map(token => {
        const upper = token.toUpperCase();
        
        // handle explicit spacer
        if (upper === "(SPACE)") return " ";
        
        if (REVERSE_MAP[upper]) {
            return REVERSE_MAP[upper];
        }
        
        if (token.length === 1) return token;

        return token;
    });

    return result.join("");
}