const CURVE_MAP = {
    'P-256': 'P-256',
    'P-384': 'P-384',
    'P-521': 'P-521'
};

/**
 * signs a message using a Private Key (PEM).
 */
export async function signECDSA(privateKeyPEM, message, curve, hashAlgo) {
    // import Private Key
    const binaryKey = pemToArrayBuffer(privateKeyPEM);
    const key = await window.crypto.subtle.importKey(
        "pkcs8",
        binaryKey,
        {
            name: "ECDSA",
            namedCurve: CURVE_MAP[curve]
        },
        false,
        ["sign"]
    );

    // sign
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signature = await window.crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: hashAlgo }
        },
        key,
        data
    );

    // return Hex string
    return bufferToHex(signature);
}

/**
 * signature verification
 */
export async function verifyECDSA(publicKeyPEM, signatureHex, message, curve, hashAlgo) {
    // import Public Key
    const binaryKey = pemToArrayBuffer(publicKeyPEM);
    const key = await window.crypto.subtle.importKey(
        "spki",
        binaryKey,
        {
            name: "ECDSA",
            namedCurve: CURVE_MAP[curve]
        },
        false,
        ["verify"]
    );

    // verify
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signature = hexToBuffer(signatureHex);

    const isValid = await window.crypto.subtle.verify(
        {
            name: "ECDSA",
            hash: { name: hashAlgo }
        },
        key,
        signature,
        data
    );

    return isValid;
}

function pemToArrayBuffer(pem) {
    // remove headers and newlines
    const b64 = pem
        .replace(/-----BEGIN [^-]+-----/, '')
        .replace(/-----END [^-]+-----/, '')
        .replace(/\s/g, '');
    
    const binaryString = window.atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function hexToBuffer(hex) {
    // remove spaces if any
    const clean = hex.replace(/\s/g, '');
    if (clean.length % 2 !== 0) throw new Error("Invalid Hex length");
    
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
        bytes[i / 2] = parseInt(clean.substr(i, 2), 16);
    }
    return bytes.buffer;
}