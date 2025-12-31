/**
 * UTF encoder/decoder
 * @param {string} input - input string 
 * @param {string} encoding - 'utf-8', 'utf-16le', 'utf-16be', 'utf-32le', 'utf-32be'.
 * @param {string} mode - 'encode' (text->bytes) or 'decode' (bytes->text).
 */
export function processUtf(input, encoding, mode) {
    if (!input) return "";

    if (mode === 'encode') {
        return textToHexBytes(input, encoding);
    } else {
        return hexBytesToText(input, encoding);
    }
}

function textToHexBytes(text, encoding) {
    let bytes;

    switch (encoding) {
        case 'utf-8':
            bytes = new TextEncoder().encode(text);
            break;
        case 'utf-16le':
        case 'utf-16be':
            bytes = encodeUtf16(text, encoding === 'utf-16be');
            break;
        case 'utf-32le':
        case 'utf-32be':
            bytes = encodeUtf32(text, encoding === 'utf-32be');
            break;
        default:
            throw new Error(`Unsupported encoding: ${encoding}`);
    }

    return Array.from(bytes)
        .map(b => `\\x${b.toString(16).padStart(2, '0').toUpperCase()}`)
        .join('');
}

function hexBytesToText(hexStr, encoding) {
    // remove \x, 0x, spaces, commas
    // expect input like "\x48\x69" or "48 69" or "0x48, 0x69"
    const cleanHex = hexStr.replace(/(\\x|0x|\s|,)/g, '');
    
    if (cleanHex.length % 2 !== 0) {
        throw new Error("Invalid Hex string. Length must be even.");
    }

    const byteLength = cleanHex.length / 2;
    const bytes = new Uint8Array(byteLength);

    for (let i = 0; i < byteLength; i++) {
        bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
    }

    try {
        const decoder = new TextDecoder(encoding);
        return decoder.decode(bytes);
    } catch (e) {
        if (encoding.endsWith('be')) {
           return decodeBigEndianManual(bytes, encoding);
        }
        throw new Error(`Error decoding ${encoding}: ${e.message}`);
    }
}

function encodeUtf16(str, isBigEndian) {
    const byteArray = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        const b1 = code & 0xFF;
        const b2 = (code >> 8) & 0xFF;
        if (isBigEndian) {
            byteArray.push(b2, b1);
        } else {
            byteArray.push(b1, b2);
        }
    }
    return new Uint8Array(byteArray);
}

function encodeUtf32(str, isBigEndian) {
    const byteArray = [];
    for (let char of str) {
        const code = char.codePointAt(0);
        const b1 = code & 0xFF;
        const b2 = (code >> 8) & 0xFF;
        const b3 = (code >> 16) & 0xFF;
        const b4 = (code >> 24) & 0xFF;
        
        if (isBigEndian) {
            byteArray.push(b4, b3, b2, b1);
        } else {
            byteArray.push(b1, b2, b3, b4);
        }
    }
    return new Uint8Array(byteArray);
}

function decodeBigEndianManual(bytes, encoding) {
    let result = "";
    const step = encoding.includes('32') ? 4 : 2;
    
    for (let i = 0; i < bytes.length; i += step) {
        let code = 0;
        if (step === 2) {
            // UTF-16BE
            code = (bytes[i] << 8) | bytes[i+1];
        } else {
            // UTF-32BE
            code = (bytes[i] << 24) | (bytes[i+1] << 16) | (bytes[i+2] << 8) | bytes[i+3];
        }
        result += String.fromCodePoint(code);
    }
    return result;
}