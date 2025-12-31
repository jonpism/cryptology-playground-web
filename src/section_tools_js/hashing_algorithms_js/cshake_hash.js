import { cshake128, cshake256 } from "@noble/hashes/sha3-addons.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { inputEncoding } from '../helpers/inputEncoding.js';

const ALGORITHMS = {
    'cSHAKE128': cshake128,
    'cSHAKE256': cshake256
};

export function processCShake(text, variant, outputBits = 256, encoding = 'utf-8', customStr = "", funcNameStr = "") {
    if (!text) throw new Error("Please enter some text.");
    
    // bits to Number
    const bits = Number(outputBits);
    if (isNaN(bits) || bits <= 0) throw new Error("Output bit length must be positive.");
    if (bits % 8 !== 0) throw new Error("Output bit length must be a multiple of 8.");

    const hashFunc = ALGORITHMS[variant];
    if (!hashFunc) throw new Error(`Algorithm ${variant} is not supported.`);

    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    const outputBytes = bits / 8;

    // encode custom strings to bytes
    const encoder = new TextEncoder();
    const customBytes = customStr ? encoder.encode(customStr) : new Uint8Array(0);
    const funcNameBytes = funcNameStr ? encoder.encode(funcNameStr) : new Uint8Array(0);

    const options = {
        dkLen: outputBytes,
        // Use the specific key names required by @noble/hashes
        personalization: customBytes, // NIST "S" (Customization)
        NISTfn: funcNameBytes         // NIST "N" (Function Name)
    };

    // calculate Hash
    const digest = hashFunc(bytes, options);

    const hex = bytesToHex(digest);
    const base64 = btoa(String.fromCharCode(...digest));

    return {
        hex: hex,
        base64: base64,
        actualBits: digest.length * 8
    };
}