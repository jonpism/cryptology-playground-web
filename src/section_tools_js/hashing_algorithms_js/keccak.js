import { keccak_224, keccak_256, keccak_384, keccak_512 } from '@noble/hashes/sha3.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { inputEncoding } from '../helpers/inputEncoding.js';

const ALGORITHMS = {
    'Keccak-224': keccak_224,
    'Keccak-256': keccak_256,
    'Keccak-384': keccak_384,
    'Keccak-512': keccak_512
};

/**
 * calculates Keccak hash for the selected bit length.
 * @param {string} text - input text.
 * @param {string} variant - algorithm name
 * @param {string} encoding - 'utf-8', 'hex', etc.
 */
export function processKeccak(text, variant, encoding = 'utf-8') {
    if (!text) throw new Error("Please enter some text.");
    
    const hashFunc = ALGORITHMS[variant];
    if (!hashFunc) throw new Error(`Algorithm ${variant} is not supported.`);

    // convert input to Uint8Array using universal helper
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