import { md4, md5 } from "hash-wasm";
import { inputEncoding } from '../helpers/inputEncoding';

const ALGORITHMS = {
    'MD4': md4,
    'MD5': md5
};

/**
 * calculates MD4 or MD5 hash.
 * @param {string} text - input data.
 * @param {string} algoName - 'MD4' or 'MD5'.
 * @param {string} encoding - 'utf-8', 'hex', 'base64', etc.
 */
export async function processMD(text, algoName, encoding = 'utf-8') {
    if (!text) throw new Error("Please enter some text.");
    
    const hashFunc = ALGORITHMS[algoName];
    if (!hashFunc) throw new Error(`Algorithm ${algoName} is not supported.`);

    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    // calculate Hash (hash-wasm accepts Uint8Array)
    // returns a Hex string
    const hex = await hashFunc(bytes);

    // convert Hex to Base64
    const base64 = hexToBase64(hex);

    return {
        hex: hex,
        base64: base64,
        bitLength: 128
    };
}

function hexToBase64(hexstring) {
    const match = hexstring.match(/\w{2}/g);
    const generator = (function* () {
        while (match.length >= 1) {
            yield parseInt(match.shift(), 16);
        }
    })();
    return btoa(String.fromCharCode(...generator));
}