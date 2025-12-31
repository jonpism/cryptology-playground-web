import { blake3 } from '@noble/hashes/blake3.js';
import { blake2b, blake2s } from '@noble/hashes/blake2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { inputEncoding } from '../helpers/inputEncoding';

const ALGORITHMS = {
    'BLAKE2s': blake2s,   // optimized for 32-bit platforms, produces 32 bytes (256 bits)
    'BLAKE2b': blake2b,   // optimized for 64-bit platforms, produces 64 bytes (512 bits)
    'BLAKE3': blake3      
};

/**
 * calculates BLAKE family hash.
 * @param {string} text - input data.
 * @param {string} variant - algorithm variant.
 * @param {string} encoding - 'utf-8', 'hex', 'base64', etc.
 */
export function processBLAKE(text, variant, encoding = 'utf-8') {
    if (!text) throw new Error("Please enter some text.");
    
    const hashFunc = ALGORITHMS[variant];
    if (!hashFunc) throw new Error(`Algorithm ${variant} is not supported or module is missing.`);

    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    // calculate Hash
    const digest = hashFunc(bytes);

    const hex = bytesToHex(digest);
    const base64 = btoa(String.fromCharCode(...digest));

    return {
        hex: hex,
        base64: base64,
        bitLength: digest.length * 8
    };
}