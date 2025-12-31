import { whirlpool } from "hash-wasm";
import { inputEncoding } from '../helpers/inputEncoding.js';

/**
 * whirlpool hash 512-bit
 * @param {string} text - input data.
 * @param {string} encoding - 'utf-8', 'hex', 'base64', etc.
 */
export async function processWhirlpool(text, encoding = 'utf-8') {
    if (!text) throw new Error("Please enter some text.");

    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    // calculate hash
    const hex = await whirlpool(bytes);

    // convert Hex to Base64
    const base64 = hexToBase64(hex);

    return {
        hex: hex,
        base64: base64,
        bitLength: 512
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