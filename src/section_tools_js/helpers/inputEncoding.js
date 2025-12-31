import { hexToBytes } from '@noble/hashes/utils.js';
// https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings

/**
 * cache for generated maps
 * prevents us from rebuilding the map every time the user types a letter.
 */
const ENCODING_CACHE = {};

/**
 * dynamically builds a reverse map for any single-byte encoding supported by the browser
 */
function getMapForEncoding(encodingLabel) {
    if (ENCODING_CACHE[encodingLabel]) return ENCODING_CACHE[encodingLabel];

    const map = {};
    const decoder = new TextDecoder(encodingLabel, { fatal: false });
    const buffer = new Uint8Array(1);

    // loop through all possible byte values
    for (let i = 0; i < 256; i++) {
        buffer[0] = i;
        try {
            // decode the byte to a character
            const char = decoder.decode(buffer);
            
            // only store valid, single characters
            if (char.length === 1 && char !== '') {
                // if a character maps to multiple bytes, we usually keep the first one found.
                if (map[char] === undefined) {
                    map[char] = i;
                }
            }
        } catch (e) {
            continue; 
        }
    }
    
    ENCODING_CACHE[encodingLabel] = map;
    return map;
}

/**
 * converts user input into a Uint8Array based on the selected encoding.
 * @param {string} input - raw text from the input box.
 * @param {string} encoding - 'windows-1251', 'ibm866' etc
 */
export function inputEncoding(input, encoding) {
    if (!input) return new Uint8Array(0);

    // normalize encoding string to lowercase to be safe
    const format = encoding.toLowerCase();

    try {
        if (format === 'hex') {
            const clean = input.replace(/\s+/g, '').replace(/^0x/i, '');
            return hexToBytes(clean);
        }
        if (format === 'base64') {
            const binary = atob(input);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            return bytes;
        }

        if (format === 'utf-8' || format === 'text') {
            return new TextEncoder().encode(input);
        }

        if (format === 'utf-16le') {
            const bytes = new Uint8Array(input.length * 2);
            for (let i = 0; i < input.length; i++) {
                const code = input.charCodeAt(i);
                bytes[i * 2] = code & 0xff;        // low byte
                bytes[i * 2 + 1] = (code >> 8) & 0xff; // high byte
            }
            return bytes;
        }
        if (format === 'utf-16be') {
            const bytes = new Uint8Array(input.length * 2);
            for (let i = 0; i < input.length; i++) {
                const code = input.charCodeAt(i);
                bytes[i * 2] = (code >> 8) & 0xff; // high byte
                bytes[i * 2 + 1] = code & 0xff;        // low byte
            }
            return bytes;
        }

        if (format === 'x-user-defined') {
            const bytes = new Uint8Array(input.length);
            for (let i = 0; i < input.length; i++) {
                const code = input.charCodeAt(i);
                if (code <= 0x7F) {
                    bytes[i] = code;
                } else if (code >= 0xF780 && code <= 0xF7FF) {
                    bytes[i] = code - 0xF780 + 0x80;
                } else {
                    // fallback: just take low byte
                    bytes[i] = code & 0xFF;
                }
            }
            return bytes;
        }
        
        const map = getMapForEncoding(format);
        const bytes = new Uint8Array(input.length);
        
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            
            // try to find the char in our generated map
            let byteVal = map[char];
            
            // if not found, check if it's standard ASCII (0-127)
            // most legacy encodings correspond 1:1 with ASCII for the first 128 chars.
            if (byteVal === undefined) {
                const code = input.charCodeAt(i);
                if (code < 128) {
                    byteVal = code;
                } else {
                    throw new Error(`Character '${char}' cannot be represented in ${encoding}`);
                }
            }
            bytes[i] = byteVal;
        }
        return bytes;

    } catch (e) {
        throw new Error(`Encoding Error (${encoding}): ${e.message}`);
    }
}