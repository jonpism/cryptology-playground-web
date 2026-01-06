import * as openpgp from 'openpgp';

/**
 * Generates RSA key pair in PEM format or PGP .asc format.
 * @param {number} modulusLength - key size (1024, 2048, 4096)
 * @param {string} format - pem or pgp
 */
export async function generateRSAKeyPair(modulusLength, format = 'pgp') {
    if (format === 'pgp') {
        return await generatePGPKeys(modulusLength);
    } else {
        return await generatePEMKeys(modulusLength);
    }
}

// pgp OpenPGP.js
async function generatePGPKeys(modulusLength) {
    try {
        const { privateKey, publicKey } = await openpgp.generateKey({
            type: 'rsa',
            rsaBits: modulusLength,
            userIDs: [{ name: 'Cryptology Playground', email: 'user@playground.local' }],
            format: 'armored'
        });
        return { privateKey, publicKey };
    } catch (err) {
        throw new Error(`PGP Generation failed: ${err.message}`);
    }
}

// rsa raw
async function generatePEMKeys(modulusLength) {
    try {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: modulusLength,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        );

        const privateBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        const publicBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);

        return {
            privateKey: toPem(privateBuffer, "PRIVATE KEY"),
            publicKey: toPem(publicBuffer, "PUBLIC KEY")
        };
    } catch (err) {
        throw new Error(`PEM Generation failed: ${err.message}`);
    }
}

function toPem(buffer, label) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const b64 = window.btoa(binary);
    const wrapped = b64.match(/.{1,64}/g).join('\n');
    return `-----BEGIN ${label}-----\n${wrapped}\n-----END ${label}-----`;
}