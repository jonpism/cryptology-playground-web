/**
 * Caesar Cipher encryption and decryption
 * @param {string} text - input text.
 * @param {number} shift - shift value (+ for encrypt, - for decrypt).
 */
export function processCaesarCipher(text, shift) {
    if (!text) return "";

    // handle large numbers or negative values correctly
    const s = ((shift % 26) + 26) % 26;

    return text.split('').map(char => {
        // check if character is a letter
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            
            // uppercase letters (65-90)
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + s) % 26) + 65);
            }
            
            // lowercase letters (97-122)
            else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + s) % 26) + 97);
            }
        }
        // non-alphabetic characters remain unchanged
        return char;
    }).join('');
}