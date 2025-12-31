import CryptoJS from 'crypto-js';

const MODE_MAP = {
    'ECB': CryptoJS.mode.ECB,
    'CBC': CryptoJS.mode.CBC
};

const PADDING_MAP = {
    'Pkcs7': CryptoJS.pad.Pkcs7,
    'ZeroPadding': CryptoJS.pad.ZeroPadding,
    'NoPadding': CryptoJS.pad.NoPadding
};

/**
 * encrypts message using Triple DES.
 * @param {string} plaintext - msg - plaintext
 * @param {string} key - secret key (16 or 24 bytes).
 * @param {string} iv - IV (optional, required for CBC).
 * @param {string} modeStr - 'ECB' or 'CBC'.
 * @param {string} paddingStr - 'Pkcs7', etc.
 */
export function tripleDesEncrypt(plaintext, key, iv, modeStr, paddingStr) {
    try {
        const keyParsed = parseKeyOrIV(key);
        const ivParsed = iv ? parseKeyOrIV(iv) : undefined;
        
        // 3DES keys must be 24 bytes (192 bits) or 16 bytes (128 bits - 2 Key 3DES)
        // length check.
        if (keyParsed.sigBytes !== 24 && keyParsed.sigBytes !== 16) {
            throw new Error(`Invalid Key Length: 3DES requires 16 or 24 bytes. You provided ${keyParsed.sigBytes} bytes.`);
        }

        const options = {
            mode: MODE_MAP[modeStr] || CryptoJS.mode.ECB,
            padding: PADDING_MAP[paddingStr] || CryptoJS.pad.Pkcs7
        };

        if (ivParsed && modeStr !== 'ECB') {
            options.iv = ivParsed;
        }

        const encrypted = CryptoJS.TripleDES.encrypt(plaintext, keyParsed, options);
        return encrypted.toString(); // Base64
    } catch (e) {
        throw new Error("Encryption Error: " + e.message);
    }
}

/**
 * decryption method.
 */
export function tripleDesDecrypt(ciphertext, key, iv, modeStr, paddingStr) {
    try {
        const keyParsed = parseKeyOrIV(key);
        const ivParsed = iv ? parseKeyOrIV(iv) : undefined;
        
        if (keyParsed.sigBytes !== 24 && keyParsed.sigBytes !== 16) {
            throw new Error(`Invalid Key Length: 3DES requires 16 or 24 bytes.`);
        }

        const options = {
            mode: MODE_MAP[modeStr] || CryptoJS.mode.ECB,
            padding: PADDING_MAP[paddingStr] || CryptoJS.pad.Pkcs7
        };

        if (ivParsed && modeStr !== 'ECB') {
            options.iv = ivParsed;
        }

        const decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyParsed, options);
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        
        if (!result) throw new Error("Decryption failed. Check Key, IV, or Mode.");
        return result;
    } catch (e) {
        throw new Error("Decryption Error: " + e.message);
    }
}

/**
 * generate random 3DES key (24 bytes / 192 bits) and IV (8 bytes / 64 bits)
 */
export function generate3DESParams(keySize = 24) {
    return {
        key: CryptoJS.lib.WordArray.random(keySize).toString(CryptoJS.enc.Hex),
        iv: CryptoJS.lib.WordArray.random(8).toString(CryptoJS.enc.Hex)
    };
}

function parseKeyOrIV(input) {
    if (/^[0-9a-fA-F]+$/.test(input) && input.length % 2 === 0) {
        return CryptoJS.enc.Hex.parse(input);
    }
    return CryptoJS.enc.Utf8.parse(input);
}