/**
 * generates an RSA Key Pair (RSA-OAEP).
 * @param {number} modulusLength - key size in bits: 1024, 2048, 4096
 */
export async function generateRSAKeyPair(modulusLength) {
    // generate key pair
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: modulusLength,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: "SHA-256"
        },
        true, // extractable
        ["encrypt", "decrypt"]
    );

    // export keys to PEM format
    const privateKeyBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    const publicKeyBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);

    // convert ArrayBuffer to PEM string
    return {
        privateKey: toPem(privateKeyBuffer, "PRIVATE KEY"),
        publicKey: toPem(publicKeyBuffer, "PUBLIC KEY")
    };
}

function bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function toPem(buffer, label) {
    const b64 = bufferToBase64(buffer);
    // wrap at 64 chars for valid PEM format
    const wrapped = b64.match(/.{1,64}/g).join('\n');
    return `-----BEGIN ${label}-----\n${wrapped}\n-----END ${label}-----`;
}