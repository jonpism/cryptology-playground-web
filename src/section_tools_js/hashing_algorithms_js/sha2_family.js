import { sha256, sha384, sha512 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { inputEncoding } from '../helpers/inputEncoding.js';

const ALGORITHMS = {
    'SHA2-256': sha256,
    'SHA2-384': sha384,
    'SHA2-512': sha512
};

/**
 * calculates hash for the selected SHA algorithm.
 * @param {string} text - input data.
 * @param {string} algoName - 'SHA2-256', 'SHA2-512', etc.
 * @param {string} encoding - 'utf-8', 'hex', or 'base64'.
 */
export function processSHA2(text, algoName, encoding = 'utf-8') {
    if (!text) throw new Error("Please enter some text.");
    
    const hashFunc = ALGORITHMS[algoName];
    if (!hashFunc) throw new Error(`Algorithm ${algoName} is not supported.`);

    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    const digest = hashFunc(bytes);

    const hex = bytesToHex(digest);
    const base64 = btoa(String.fromCharCode(...digest));

    return {
        hex: hex,
        base64: base64,
        bitLength: digest.length * 8
    };
}