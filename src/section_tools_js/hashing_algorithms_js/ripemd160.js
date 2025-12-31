import { ripemd160 } from '@noble/hashes/legacy.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { inputEncoding } from '../helpers/inputEncoding';

/**
 * calculates RIPEMD-160 hash using @noble/hashes.
 * @param {string} text - input text.
 * @param {string} encoding - 'utf-8', 'hex', 'base64, etc.
 * @returns {Object} - Hex and Base64 formats.
 */
export function processRIPEMD160(text, encoding = 'utf-8') {
    if (!text) throw new Error("Please enter some text.");

    // convert string to Uint8Array (bytes)
    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    // calculate RIPEMD-160 (returns Uint8Array)
    const digest = ripemd160(bytes);

    const hex = bytesToHex(digest);
    const base64 = btoa(String.fromCharCode(...digest));

    return {
        hex: hex,
        base64: base64
    };
}