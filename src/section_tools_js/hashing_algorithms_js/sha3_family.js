import { sha3_224, sha3_256, sha3_384, sha3_512 } from '@noble/hashes/sha3.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { inputEncoding } from '../helpers/inputEncoding.js';

const ALGORITHMS = {
    'SHA3-224': sha3_224,
    'SHA3-256': sha3_256,
    'SHA3-384': sha3_384,
    'SHA3-512': sha3_512
};

/**
 * calculates hash for the selected SHA-3 algorithm.
 * @param {string} text - input data.
 * @param {string} algoName - 'SHA3-256', 'SHA3-512', etc.
 * @param {string} encoding - 'utf-8', 'hex', etc.
 */
export function processSHA3(text, algoName, encoding = 'utf-8') {
    if (!text) throw new Error("Please enter some text.");
    
    const hashFunc = ALGORITHMS[algoName];
    if (!hashFunc) throw new Error(`Algorithm ${algoName} is not supported.`);

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