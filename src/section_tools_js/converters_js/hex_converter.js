import { inputEncoding } from '../helpers/inputEncoding';

/**
 * converts text to Hex and vice versa.
 * @param {string} input - input string.
 * @param {string} mode - 'encode' or 'decode'
 * @param {string} encoding - utf-8, windows-1252, etc.
 */
export function processHex(input, mode, encoding = 'utf-8') {
    if (!input) return "";
    
    const cleanInput = input.trim();

    if (mode === 'encode') {
        return textToHex(cleanInput, encoding);
    } else {
        return hexToText(cleanInput, encoding);
    }
}

function textToHex(text, encoding) {
    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    // map every byte to a 2-digit hex code
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToText(hexStr, encoding) {
    // remove spaces, colons, dashes
    const cleanHex = hexStr.replace(/[\s:-]/g, '');

    if (cleanHex.length % 2 !== 0) {
        throw new Error("Invalid Hex string. Length must be even.");
    }
    if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
        throw new Error("Invalid characters found. Hex only allows 0-9 and A-F.");
    }

    // Hex to Uint8Array conversion
    const byteCount = cleanHex.length / 2;
    const bytes = new Uint8Array(byteCount);

    for (let i = 0; i < byteCount; i++) {
        const byteVal = parseInt(cleanHex.substr(i * 2, 2), 16);
        bytes[i] = byteVal;
    }

    // TextDecoder for proper charset support
    try {
        const decoder = new TextDecoder(encoding);
        return decoder.decode(bytes);
    } catch (e) {
        throw new Error(`The encoding '${encoding}' is not supported.`);
    }
}