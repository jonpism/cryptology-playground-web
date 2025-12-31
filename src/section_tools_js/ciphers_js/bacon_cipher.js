const BACON_TABLE = {
    "A": "aaaaa", "B": "aaaab", "C": "aaaba", "D": "aaabb", "E": "aabaa", "F": "aabab", "G": "aabba", 
    "H": "aabbb", "I": "abaaa", "J": "abaab", "K": "ababa", "L": "ababb", "M": "abbaa", "N": "abbab",
    "O": "abbba", "P": "abbbb", "Q": "baaaa", "R": "baaab", "S": "baaba", "T": "baabb", "U": "babaa",
    "V": "babab", "W": "babba", "X": "babbb", "Y": "bbaaa", "Z": "bbaab"};

// reverse table for decoding
const REVERSE_TABLE = Object.entries(BACON_TABLE).reduce((acc, [char, code]) => {
    if (!acc[code]) acc[code] = char; 
    return acc;
}, {});

/**
 * encodes text into Bacon Cipher.
 */
export function encodeBacon(text) {
    if (!text) return "";
    
    return text.toUpperCase().split('').map(char => {
        if (char === ' ') return ' '; // preserve spaces
        return BACON_TABLE[char] || ''; // skip unknown chars
    }).join(' ').replace(/\s+/g, ' ').trim(); // clean up extra spaces
}

/**
 * decodes Bacon Cipher text back to English.
 */
export function decodeBacon(text) {
    if (!text) return "";

    // remove everything except a, b, and space
    // support A/B uppercase input
    const cleanText = text.toLowerCase().replace(/[^ab ]/g, '');
    
    const words = cleanText.split(' ');
    
    return words.map(word => {
        // split word into chunks of 5
        const chunks = word.match(/.{1,5}/g) || [];
        return chunks.map(chunk => REVERSE_TABLE[chunk] || '?').join('');
    }).join(' ');
}