import { inputEncoding } from '../helpers/inputEncoding';

const ALPHABETS = {
    base32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    base45: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:",
    base58: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    base62: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    base85: "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
    base92: "!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}"
};

/**
 * encodes/decodes Data using various Base encodings + RFC Variants.
 * @param {string} input - input string.
 * @param {string} base - 'base32', 'base64', etc.
 * @param {string} mode - 'encode' or 'decode'.
 * @param {string} encoding - input text encoding (utf-8, hex, etc).
 * @param {string} rfc - RFC variant for Base64
 */
export function processBaseEncoder(input, base, mode, encoding = 'utf-8', rfc = 'RFC4648') {
    if (!input) return "";

    // encode mode
    if (mode === 'encode') {
        let bytes;
        try {
            bytes = inputEncoding(input, encoding);
        } catch (e) {
            throw new Error(e.message);
        }

        switch(base) {
            case 'base32': return encodeBase32(bytes);
            case 'base45': return encodeBase45(bytes);
            case 'base58': return encodeBaseX(bytes, ALPHABETS.base58);
            case 'base62': return encodeBaseX(bytes, ALPHABETS.base62);
            // handle Base64 RFC variants
            case 'base64': return encodeBase64RFC(bytes, rfc);
            case 'base85': return encodeAscii85(bytes);
            case 'base92': return encodeBaseX(bytes, ALPHABETS.base92);
            default: throw new Error("Unknown Base");
        }
    } 
    // decode mode
    else {
        const cleanInput = input.trim();
        let decodedBytes;

        switch(base) {
            case 'base32': decodedBytes = decodeBase32(cleanInput); break;
            case 'base45': decodedBytes = decodeBase45(cleanInput); break;
            case 'base58': decodedBytes = decodeBaseX(cleanInput, ALPHABETS.base58); break;
            case 'base62': decodedBytes = decodeBaseX(cleanInput, ALPHABETS.base62); break;
            // handle Base64 RFC variants
            case 'base64': decodedBytes = decodeBase64RFC(cleanInput, rfc); break;
            case 'base85': decodedBytes = decodeAscii85(cleanInput); break;
            case 'base92': decodedBytes = decodeBaseX(cleanInput, ALPHABETS.base92); break;
            default: throw new Error("Unknown Base");
        }
        
        return new TextDecoder().decode(decodedBytes);
    }
}

// Base64 RFC handler
function encodeBase64RFC(bytes, rfc) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    let b64 = btoa(binary);

    // apply rfc modifications
    switch (rfc) {
        case 'RFC4648': 
            // standard
            return b64;
        
        case 'RFC4648-URL':
            // URL Safe
            return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        case 'RFC2045':
            // MIME: standard alphabet, max 76 chars per line
            return b64.match(/.{1,76}/g).join('\r\n');

        case 'RFC2152':
            // UTF-7: keeps the standard alphabet but often strips padding in usage.
            return b64.replace(/=+$/, '');

        case 'RFC3501':
            // IMAP: ',' instead of '/' and no padding.
            return b64.replace(/\//g, ',').replace(/=+$/, '');

        default:
            return b64;
    }
}

function decodeBase64RFC(input, rfc) {
    let clean = input;

    switch (rfc) {
        case 'RFC4648-URL':
            clean = clean.replace(/-/g, '+').replace(/_/g, '/');
            break;
        case 'RFC2045':
            clean = clean.replace(/[\r\n]/g, ''); // remove newlines
            break;
        case 'RFC3501':
            clean = clean.replace(/,/g, '/'); // ',' back to '/'
            break;
    }

    // add padding if missing
    while (clean.length % 4) {
        clean += '=';
    }

    try {
        const binary = atob(clean);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    } catch (e) {
        throw new Error("Invalid Base64 sequence for " + rfc);
    }
}

function encodeBase32(bytes) {
    let bits = 0; let value = 0; let output = "";
    for (let i = 0; i < bytes.length; i++) {
        value = (value << 8) | bytes[i];
        bits += 8;
        while (bits >= 5) {
            output += ALPHABETS.base32[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) output += ALPHABETS.base32[(value << (5 - bits)) & 31];
    while (output.length % 8 !== 0) output += "=";
    return output;
}
function decodeBase32(input) {
    const map = {}; for(let i=0; i<ALPHABETS.base32.length; i++) map[ALPHABETS.base32[i]] = i;
    let clean = input.replace(/=+$/, '').toUpperCase();
    let bits = 0; let value = 0; let output = [];
    for (let i = 0; i < clean.length; i++) {
        const val = map[clean[i]];
        if (val === undefined) throw new Error("Invalid Base32 char");
        value = (value << 5) | val;
        bits += 5;
        while (bits >= 8) { output.push((value >>> (bits - 8)) & 255); bits -= 8; }
    }
    return new Uint8Array(output);
}

function encodeBase45(bytes) {
    let output = "";
    for (let i = 0; i < bytes.length; i += 2) {
        if (bytes.length - i > 1) {
            const val = (bytes[i] << 8) + bytes[i + 1];
            output += ALPHABETS.base45[val % 45] + ALPHABETS.base45[Math.floor((val % (45 * 45)) / 45)] + ALPHABETS.base45[Math.floor(val / (45 * 45))]; // Correct order: low byte first char
        } else {
            const val = bytes[i];
            output += ALPHABETS.base45[val % 45] + ALPHABETS.base45[Math.floor(val / 45)];
        }
    }
    return output;
}
function decodeBase45(input) {
     const map = {}; for(let i=0; i<ALPHABETS.base45.length; i++) map[ALPHABETS.base45[i]] = i;
     const output = [];
     for (let i = 0; i < input.length; i += 3) {
         if (input.length - i >= 3) {
             const x = map[input[i]] + map[input[i+1]] * 45 + map[input[i+2]] * 45 * 45;
             output.push(x >> 8); output.push(x & 255);
         } else {
             const x = map[input[i]] + map[input[i+1]] * 45;
             output.push(x);
         }
     }
     return new Uint8Array(output);
}

function encodeAscii85(bytes) {
    let output = "";
    const padding = (4 - (bytes.length % 4)) % 4;
    const paddedBytes = new Uint8Array(bytes.length + padding);
    paddedBytes.set(bytes);
    for (let i = 0; i < paddedBytes.length; i += 4) {
        let val = (paddedBytes[i] << 24) | (paddedBytes[i+1] << 16) | (paddedBytes[i+2] << 8) | paddedBytes[i+3];
        let chars = [];
        for (let j = 0; j < 5; j++) { chars.unshift(ALPHABETS.base85[val % 85]); val = Math.floor(val / 85); }
        output += chars.join("");
    }
    return output.substring(0, output.length - padding);
}
function decodeAscii85(input) {
    let clean = input.replace(/\s/g, ''); 
    const padding = (5 - (clean.length % 5)) % 5;
    clean += 'u'.repeat(padding);
    const map = {}; for(let i=0; i<ALPHABETS.base85.length; i++) map[ALPHABETS.base85[i]] = i;
    const output = [];
    for (let i = 0; i < clean.length; i += 5) {
        let val = 0;
        for (let j = 0; j < 5; j++) { val = val * 85 + map[clean[i+j]]; }
        output.push((val >>> 24) & 255); output.push((val >>> 16) & 255); output.push((val >>> 8) & 255); output.push(val & 255);
    }
    return new Uint8Array(output.slice(0, output.length - padding));
}

function encodeBaseX(bytes, alphabet) {
    if (bytes.length === 0) return "";
    let value = 0n; for (let i = 0; i < bytes.length; i++) value = (value * 256n) + BigInt(bytes[i]);
    const base = BigInt(alphabet.length);
    let output = "";
    while (value > 0n) { output = alphabet[Number(value % base)] + output; value = value / base; }
    for (let i = 0; i < bytes.length; i++) { if (bytes[i] === 0) output = alphabet[0] + output; else break; }
    return output;
}
function decodeBaseX(input, alphabet) {
    if (input.length === 0) return new Uint8Array(0);
    const base = BigInt(alphabet.length);
    const map = {}; for (let i = 0; i < alphabet.length; i++) map[alphabet[i]] = BigInt(i);
    let value = 0n;
    for (let i = 0; i < input.length; i++) {
        if (map[input[i]] === undefined) throw new Error(`Invalid char`);
        value = (value * base) + map[input[i]];
    }
    const bytes = []; while (value > 0n) { bytes.unshift(Number(value % 256n)); value = value / 256n; }
    for (let i = 0; i < input.length; i++) { if (input[i] === alphabet[0]) bytes.unshift(0); else break; }
    return new Uint8Array(bytes);
}