// morse code dictionary
const MORSE_TABLE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};

const REVERSE_TABLE = Object.entries(MORSE_TABLE).reduce((acc, [char, code]) => {
    acc[code] = char;
    return acc;
}, {});

/**
 * converts text to Morse Code and vice versa.
 * @param {string} input - input string.
 * @param {string} mode - 'text2morse' or 'morse2text'.
 */
export function processMorse(input, mode) {
    if (!input || !input.trim()) return "";

    if (mode === 'text2morse') {
        return textToMorse(input);
    } else {
        return morseToText(input);
    }
}

function textToMorse(text) {
    const cleanText = text.toUpperCase().replace(/\s+/g, ' '); // normalize spaces
    
    let result = [];
    for (let char of cleanText) {
        if (char === ' ') {
            // word separation
            result.push('/'); 
        } else if (MORSE_TABLE[char]) {
            result.push(MORSE_TABLE[char]);
        } else {
            // uknown character, keep as is
            result.push(char);
        }
    }
    
    return result.join(' ');
}

function morseToText(morse) {
    // split by spaces
    const tokens = morse.trim().split(/\s+/);
    
    let result = "";
    
    for (let token of tokens) {
        if (token === '/') {
            result += " ";
        } else if (REVERSE_TABLE[token]) {
            result += REVERSE_TABLE[token];
        } else {
            // uknown patterns
            result += token;
        }
    }
    
    return result;
}