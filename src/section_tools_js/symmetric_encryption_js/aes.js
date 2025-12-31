import CryptoJS from 'crypto-js';

/**
 * AES Encryption/Decryption
 * AES-128, AES-192, AES-256 (determined by key size).
 * modes: CBC, ECB, CTR, OFB, CFB.
 * padding: Pkcs7 (default), NoPadding, etc.
 */

const MODE_MAP = {
    'CBC': CryptoJS.mode.CBC,
    'ECB': CryptoJS.mode.ECB,
    'CTR': CryptoJS.mode.CTR,
    'OFB': CryptoJS.mode.OFB,
    'CFB': CryptoJS.mode.CFB
};

const PADDING_MAP = {
    'Pkcs7': CryptoJS.pad.Pkcs7,
    'ZeroPadding': CryptoJS.pad.ZeroPadding,
    'NoPadding': CryptoJS.pad.NoPadding,
    'Iso10126': CryptoJS.pad.Iso10126,
    'Iso97971': CryptoJS.pad.Iso97971
};

/**
 * encrypts a message using AES.
 * @param {string} plaintext - message to encrypt.
 * @param {string} key - secret key (string or hex).
 * @param {string} iv - Initialization Vector (optional, hex).
 * @param {string} modeStr - 'CBC', 'ECB', etc.
 * @param {string} paddingStr - 'Pkcs7', 'NoPadding', etc.
 * @returns {string} - ciphertext in Base64.
 */
export function aesEncrypt(plaintext, key, iv, modeStr, paddingStr) {
    try {
        const keyParsed = parseKeyOrIV(key);
        const ivParsed = iv ? parseKeyOrIV(iv) : undefined;
        
        const options = {
            mode: MODE_MAP[modeStr] || CryptoJS.mode.CBC,
            padding: PADDING_MAP[paddingStr] || CryptoJS.pad.Pkcs7
        };

        if (ivParsed && modeStr !== 'ECB') {
            options.iv = ivParsed;
        }

        const encrypted = CryptoJS.AES.encrypt(plaintext, keyParsed, options);
        return encrypted.toString(); // default is Base64
    } catch (e) {
        throw new Error("Encryption Error: " + e.message);
    }
}

/**
 * decrypts a message using AES.
 * @param {string} ciphertext - Base64 encrypted string.
 * @param {string} key - secret key (string or hex).
 * @param {string} iv - Initialization Vector (optional, hex).
 * @param {string} modeStr - 'CBC', 'ECB', etc.
 * @param {string} paddingStr - 'Pkcs7', 'NoPadding', etc.
 * @returns {string} - decrypted UTF-8 string.
 */
export function aesDecrypt(ciphertext, key, iv, modeStr, paddingStr) {
    try {
        const keyParsed = parseKeyOrIV(key);
        const ivParsed = iv ? parseKeyOrIV(iv) : undefined;
        
        const options = {
            mode: MODE_MAP[modeStr] || CryptoJS.mode.CBC,
            padding: PADDING_MAP[paddingStr] || CryptoJS.pad.Pkcs7
        };

        if (ivParsed && modeStr !== 'ECB') {
            options.iv = ivParsed;
        }

        const decrypted = CryptoJS.AES.decrypt(ciphertext, keyParsed, options);
        
        // convert to UTF-8
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        
        if (!result) throw new Error("Decryption failed (empty result). Wrong Key/IV?");
        return result;
    } catch (e) {
        throw new Error("Decryption Error: " + e.message);
    }
}

/**
 * parse input (Hex vs String)
 */
function parseKeyOrIV(input) {
    // if it looks like Hex and length is even, treat as Hex
    if (/^[0-9a-fA-F]+$/.test(input) && input.length % 2 === 0) {
        return CryptoJS.enc.Hex.parse(input);
    }
    // otherwise treat as utf8 string passphrase
    return CryptoJS.enc.Utf8.parse(input);
}

/**
 * generates a random key and IV (Hex strings)
 * @param {number} keySizeBits - 128, 192, 256
 */
export function generateAESParams(keySizeBits) {
    const key = CryptoJS.lib.WordArray.random(keySizeBits / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8); // IV is always 128 bits (16 bytes) for AES
    return {
        key: key.toString(CryptoJS.enc.Hex),
        iv: iv.toString(CryptoJS.enc.Hex)
    };
}