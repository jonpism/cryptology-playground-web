const ALPHABET_SIZE = 26;

// calculate gcd
function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// modular multiplicative inverse
function modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    throw new Error(`Modular inverse does not exist for a=${a} under modulo ${m}.`);
}

/**
 * validates keys a and b
 */
export function validateKeys(a, b) {
    if (isNaN(a) || isNaN(b)) {
        throw new Error("Keys must be integers.");
    }
    if (gcd(a, ALPHABET_SIZE) !== 1) {
        throw new Error(`Key 'a' (${a}) is invalid. It must be coprime to 26 (share no common factors). Try 3, 5, 7, 9, 11...`);
    }
}

/**
 * encrypts or decrypts text using Affine Cipher.
 * @param {string} text - input text.
 * @param {number} a - multiplier key.
 * @param {number} b - shift key.
 * @param {string} mode - 'encrypt' or 'decrypt'.
 */
export function processAffineCipher(text, a, b, mode) {
    if (!text) return "";
    
    // ensure keys are integers
    a = parseInt(a);
    b = parseInt(b);

    validateKeys(a, b);

    let result = "";
    
    // pre-calculate inverse for decryption
    let a_inv = 0;
    if (mode === 'decrypt') {
        a_inv = modInverse(a, ALPHABET_SIZE);
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char.match(/[a-z]/i)) {
            const isUpper = (char === char.toUpperCase());
            const offset = isUpper ? 65 : 97;
            const x = char.charCodeAt(0) - offset;
            
            let processedVal;

            if (mode === 'encrypt') {
                // E(x) = (ax + b) mod 26
                processedVal = (a * x + b) % ALPHABET_SIZE;
            } else {
                // D(x) = a_inv * (x - b) mod 26
                // ensure positive modulo result
                const val = a_inv * (x - b);
                processedVal = ((val % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
            }

            result += String.fromCharCode(processedVal + offset);
        } else {
            // keep non-alphabetic characters as is
            result += char;
        }
    }

    return result;
}