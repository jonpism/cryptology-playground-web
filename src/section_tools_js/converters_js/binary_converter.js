import { inputEncoding } from '../helpers/inputEncoding';

/**
 * converts text to Binary and vice versa.
 * @param {string} input - input string.
 * @param {string} mode - 'encode' or 'decode'
 * @param {string} encoding - 'utf-8', 'windows-1252', etc.
 */
export function processBinary(input, mode, encoding = 'utf-8') {
    if (!input) return "";

    if (mode === 'encode') {
        return textToBinary(input, encoding);
    } else {
        return binaryToText(input, encoding);
    }
}

/**
 * text to Binary String
 */
function textToBinary(text, encoding) {
    // convert String to Uint8Array (Bytes)
    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(`Encoding Error: ${e.message}`);
    }

    // convert Bytes to Binary String 
    let binaryResult = "";
    for (let i = 0; i < bytes.length; i++) {
        const byteVal = bytes[i];
        // convert to base-2 and pad with leading zeros to ensure 8 bits
        const bin = byteVal.toString(2).padStart(8, '0');
        binaryResult += bin + " ";
    }

    return binaryResult.trim();
}

/**
 * Binary String to Text
 */
function binaryToText(binaryStr, encoding) {
    // remove spaces, newlines, or any non-0/1 characters
    const cleanBin = binaryStr.replace(/[^01]/g, '');

    if (!cleanBin) throw new Error("Input does not contain valid binary data (0s and 1s).");
    if (cleanBin.length % 8 !== 0) throw new Error("Binary string length must be a multiple of 8.");

    // convert Binary String to Uint8Array
    const byteCount = cleanBin.length / 8;
    const bytes = new Uint8Array(byteCount);

    for (let i = 0; i < byteCount; i++) {
        const byteStr = cleanBin.substr(i * 8, 8);
        bytes[i] = parseInt(byteStr, 2);
    }

    // Bytes to text
    if (encoding === 'hex') {
        return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    if (encoding === 'base64') {
        return btoa(String.fromCharCode(...bytes));
    }

    // native TextDecoder for all text charsets (utf-8, windows-1252, etc.)
    try {
        // TextDecoder handles almost all legacy encodings natively for decoding
        const decoder = new TextDecoder(encoding);
        return decoder.decode(bytes);
    } catch (e) {
        throw new Error(`The encoding '${encoding}' is not supported for decoding by your browser.`);
    }
}