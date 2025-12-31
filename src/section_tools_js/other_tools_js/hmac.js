import { hmac } from '@noble/hashes/hmac.js';
import { sha224, sha256, sha384, sha512 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
const ALGOS = {
    'SHA-256': sha256,
    'SHA-512': sha512,
    'SHA-224': sha224,
    'SHA-384': sha384
};

/**
 * calculates HMAC using the specified algorithm.
 * @param {string} message - data to authenticate.
 * @param {string} key - secret key.
 * @param {string} algoName - hash algorithm
 */
export function processHMAC(message, key, algoName) {
    if (!message) throw new Error("Please enter a message.");
    if (!key) throw new Error("Please enter a secret key.");
    
    const hashFunc = ALGOS[algoName];
    if (!hashFunc) throw new Error("Invalid algorithm selected.");

    // convert Strings to Uint8Array (Bytes)
    const encoder = new TextEncoder();
    const keyBytes = encoder.encode(key);
    const msgBytes = encoder.encode(message);

    const digest = hmac(hashFunc, keyBytes, msgBytes);

    const hex = bytesToHex(digest);
    const base64 = btoa(String.fromCharCode(...digest));

    return {
        hex: hex,
        base64: base64
    };
}
