import { shake128, shake256 } from "@noble/hashes/sha3.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { inputEncoding } from '../helpers/inputEncoding.js';

const ALGORITHMS = {
    'SHAKE128': shake128,
    'SHAKE256': shake256
};

/**
 * calculates SHAKE hash with variable output length.
 * @param {string} text - input text.
 * @param {string} variant - 'SHAKE128' or 'SHAKE256'.
 * @param {number} outputBits - desired output length in BITS (must be multiple of 8).
 * @param {string} encoding - input encoding.
 */
export function processShake(text, variant, outputBits = 256, encoding = 'utf-8') {
    if (!text) throw new Error("Please enter some text.");
    
    const bits = Number(outputBits);
    if (isNaN(bits) || bits <= 0) throw new Error("Output bit length must be a positive number.");
    if (bits % 8 !== 0) throw new Error("Output bit length must be a multiple of 8.");

    const hashFunc = ALGORITHMS[variant];
    if (!hashFunc) throw new Error(`Algorithm ${variant} is not supported.`);

    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    // calculate hash
    // @noble/hashes takes 'dkLen' in bytes
    const outputBytes = bits / 8;
    const digest = hashFunc(bytes, { dkLen: outputBytes });

    const hex = bytesToHex(digest);
    const base64 = btoa(String.fromCharCode(...digest));

    return {
        hex: hex,
        base64: base64,
        actualBits: digest.length * 8
    };
}