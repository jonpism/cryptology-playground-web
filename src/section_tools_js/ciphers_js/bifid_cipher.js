// specific grid
// B G W K Z
// Q P N D S
// I O A X E
// F C L U M
// T H Y V R
const GRID_STRING = "BGWKZQPNDSIOAXEFCLUMTHYVR";

const CHAR_TO_COORD = {};
const COORD_TO_CHAR = {};

for (let i = 0; i < 25; i++) {
    const char = GRID_STRING[i];
    const row = Math.floor(i / 5) + 1;
    const col = (i % 5) + 1;
    
    CHAR_TO_COORD[char] = { row, col };
    COORD_TO_CHAR[`${row},${col}`] = char;
}

/**
 * encrypts text using the Bifid Cipher.
 */
export function encryptBifid(plaintext) {
    if (!plaintext) return "";

    // remove non-letters
    const cleanText = plaintext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    
    if (cleanText.length === 0) return "";

    // get coordinates
    const rows = [];
    const cols = [];

    for (const char of cleanText) {
        const coord = CHAR_TO_COORD[char];
        if (coord) {
            rows.push(coord.row);
            cols.push(coord.col);
        }
    }

    // combine rows and columns (transposition)
    const combined = [...rows, ...cols];

    // read back in pairs to get ciphertext
    let ciphertext = "";
    for (let i = 0; i < combined.length; i += 2) {
        const r = combined[i];
        const c = combined[i+1];
        ciphertext += COORD_TO_CHAR[`${r},${c}`];
    }

    return ciphertext;
}

/**
 * decrypts text using the Bifid Cipher.
 */
export function decryptBifid(ciphertext) {
    if (!ciphertext) return "";

    const cleanText = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    if (cleanText.length === 0) return "";

    // get coordinates of ciphertext
    const coords = [];
    for (const char of cleanText) {
        const coord = CHAR_TO_COORD[char];
        if (coord) {
            coords.push(coord.row);
            coords.push(coord.col);
        }
    }

    // split back into rows and columns
    const midpoint = coords.length / 2;
    const rows = coords.slice(0, midpoint);
    const cols = coords.slice(midpoint);

    // reconstruct plaintext pairs
    let plaintext = "";
    for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const c = cols[i];
        plaintext += COORD_TO_CHAR[`${r},${c}`];
    }

    return plaintext;
}

export function getGridString() {
    return GRID_STRING; // for display
}