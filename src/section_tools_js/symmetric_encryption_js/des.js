import CryptoJS from 'crypto-js';

const MODE_MAP = {
    'CBC': CryptoJS.mode.CBC,
    'ECB': CryptoJS.mode.ECB
};

const PADDING_MAP = {
    'Pkcs7': CryptoJS.pad.Pkcs7,
    'ZeroPadding': CryptoJS.pad.ZeroPadding,
    'NoPadding': CryptoJS.pad.NoPadding
};

/**
 * encrypts a message using DES.
 * @param {string} plaintext - msg - plaintext
 * @param {string} key - secret key (8 bytes / 64 bits).
 * @param {string} iv - IV (optional).
 * @param {string} modeStr - 'CBC', 'ECB'.
 * @param {string} paddingStr - 'Pkcs7', etc.
 */
export function desEncrypt(plaintext, key, iv, modeStr, paddingStr) {
    try {
        const keyParsed = parseKeyOrIV(key);
        const ivParsed = iv ? parseKeyOrIV(iv) : undefined;
        
        // DES keys must be 8 bytes (64 bits)
        if (keyParsed.sigBytes !== 8) {
            throw new Error(`Invalid Key Length: DES requires exactly 8 bytes (64 bits). You provided ${keyParsed.sigBytes} bytes.`);
        }

        const options = {
            mode: MODE_MAP[modeStr] || CryptoJS.mode.CBC,
            padding: PADDING_MAP[paddingStr] || CryptoJS.pad.Pkcs7
        };

        if (ivParsed && modeStr !== 'ECB') {
            options.iv = ivParsed;
        }

        const encrypted = CryptoJS.DES.encrypt(plaintext, keyParsed, options);
        return encrypted.toString(); // Base64
    } catch (e) {
        throw new Error("Encryption Error: " + e.message);
    }
}

/**
 * decryption method
 */
export function desDecrypt(ciphertext, key, iv, modeStr, paddingStr) {
    try {
        const keyParsed = parseKeyOrIV(key);
        const ivParsed = iv ? parseKeyOrIV(iv) : undefined;
        
        if (keyParsed.sigBytes !== 8) {
            throw new Error(`Invalid Key Length: DES requires exactly 8 bytes.`);
        }

        const options = {
            mode: MODE_MAP[modeStr] || CryptoJS.mode.CBC,
            padding: PADDING_MAP[paddingStr] || CryptoJS.pad.Pkcs7
        };

        if (ivParsed && modeStr !== 'ECB') {
            options.iv = ivParsed;
        }

        const decrypted = CryptoJS.DES.decrypt(ciphertext, keyParsed, options);
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        
        if (!result) throw new Error("Decryption failed. Check Key, IV, or Mode.");
        return result;
    } catch (e) {
        throw new Error("Decryption Error: " + e.message);
    }
}

/**
 * generates random 8-byte DES key and IV
 */
export function generateDESParams() {
    return {
        key: CryptoJS.lib.WordArray.random(8).toString(CryptoJS.enc.Hex),
        iv: CryptoJS.lib.WordArray.random(8).toString(CryptoJS.enc.Hex)
    };
}

function parseKeyOrIV(input) {
    if (/^[0-9a-fA-F]+$/.test(input) && input.length % 2 === 0) {
        return CryptoJS.enc.Hex.parse(input);
    }
    return CryptoJS.enc.Utf8.parse(input);
}