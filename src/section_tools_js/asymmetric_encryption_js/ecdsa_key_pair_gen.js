const CURVE_MAP = {
    'P-256': 'P-256',
    'P-384': 'P-384',
    'P-521': 'P-521'
};

/**
 * generates an ECDSA Key Pair and returns them in PEM format.
 * @param {string} curve - 'P-256', 'P-384', or 'P-521'.
 */
export async function generateECDSAKeyPair(curve) {
    const namedCurve = CURVE_MAP[curve];

    // generate key pair
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: namedCurve
        },
        true, // extractable
        ["sign", "verify"]
    );

    // export Keys
    const privateKeyBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    const publicKeyBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);

    // convert to PEM
    const privateKeyPem = toPem(privateKeyBuffer, "PRIVATE KEY");
    const publicKeyPem = toPem(publicKeyBuffer, "PUBLIC KEY");

    return {
        privateKey: privateKeyPem,
        publicKey: publicKeyPem
    };
}

function bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function toPem(buffer, label) {
    const b64 = bufferToBase64(buffer);
    // wrap at 64 chars
    const wrapped = b64.match(/.{1,64}/g).join('\n');
    return `-----BEGIN ${label}-----\n${wrapped}\n-----END ${label}-----`;
}