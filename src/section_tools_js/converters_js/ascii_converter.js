import { inputEncoding } from '../helpers/inputEncoding';

/**
 * converts text to ASCII and vice versa.
 * @param {string} input - input string.
 * @param {string} mode - 'encode' or 'decode'
 * @param {string} encoding - utf-8, hex, windows-1252, etc.
 */
export function processAscii(input, mode, encoding = 'utf-8') {
    if (!input || !input.trim()) return "";

    if (mode === 'encode') {
        return textToAscii(input, encoding);
    } else {
        return asciiToText(input, encoding);
    }
}

/**
 * text to ASCII (Decimal)
 */
function textToAscii(text, encoding) {
    // convert input text to Bytes (Uint8Array)
    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    // convert Bytes to decimal String
    return Array.from(bytes).join(" ");
}

/**
 * ASCII to Text
 */
function asciiToText(asciiStr, encoding) {
    // parse decimal Strings to Bytes (Uint8Array)
    const numbers = asciiStr.trim().split(/[^0-9]+/);
    const bytes = new Uint8Array(numbers.length);

    for (let i = 0; i < numbers.length; i++) {
        const numStr = numbers[i];
        if (!numStr) continue;

        const val = parseInt(numStr, 10);
        
        if (isNaN(val) || val > 255) {
             throw new Error(`Value '${val}' is not a valid 8-bit byte (0-255).`);
        }
        bytes[i] = val;
    }

    // Bytes to text
    if (encoding === 'hex') {
        return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    if (encoding === 'base64') {
        return btoa(String.fromCharCode(...bytes));
    }

    // TextDecoder for text charsets
    try {
        const decoder = new TextDecoder(encoding);
        return decoder.decode(bytes);
    } catch (e) {
        throw new Error(`The encoding '${encoding}' is not supported.`);
    }
}