/**
 * Converts PEM to DER (Hex) and vice versa.
 * @param {string} input - input string.
 * @param {string} mode - 'pem2der' or 'der2pem'.
 * @param {string} headerType - header label for PEM
 */
export function processPemDer(input, mode, headerType = "CERTIFICATE") {
    if (!input || !input.trim()) return "";

    if (mode === 'pem2der') {
        return pemToDerHex(input);
    } else {
        return derHexToPem(input, headerType);
    }
}

/**
 * PEM to DER (Hex)
 */
function pemToDerHex(pemData) {
    // remove headers, footers, newlines
    let cleanStr = pemData
        .replace(/-----BEGIN [^-]+-----/g, '')
        .replace(/-----END [^-]+-----/g, '')
        .replace(/\s+/g, ''); // remove all whitespace (newlines, spaces)

    try {
        // atob() for Base64 decoding
        const binaryString = atob(cleanStr);
        
        // bytes to Hex conversion
        let hexResult = "";
        for (let i = 0; i < binaryString.length; i++) {
            const hex = binaryString.charCodeAt(i).toString(16).padStart(2, '0');
            hexResult += hex;
        }

        // return uppercase Hex for readability
        return hexResult.toUpperCase();

    } catch (e) {
        throw new Error("Invalid PEM format. Could not Decode Base64.");
    }
}

/**
 * DER (Hex) to PEM
 */
function derHexToPem(hexStr, headerType) {
    const cleanHex = hexStr.replace(/[\s:]/g, ''); // remove spaces or colons
    
    if (!/^[0-9A-Fa-f]+$/.test(cleanHex)) {
        throw new Error("Invalid Hex string. Only 0-9 and A-F allowed.");
    }
    if (cleanHex.length % 2 !== 0) {
        throw new Error("Invalid Hex length. Must be even.");
    }

    // hex to bytes to binary String
    let binaryString = "";
    for (let i = 0; i < cleanHex.length; i += 2) {
        binaryString += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
    }

    const b64 = btoa(binaryString);

    // wrap at 64 characters
    // regex to split string into chunks of 64
    const chunks = b64.match(/.{1,64}/g);
    const wrappedB64 = chunks ? chunks.join('\n') : "";

    // add Headers
    return `-----BEGIN ${headerType}-----\n${wrappedB64}\n-----END ${headerType}-----`;
}