import forge from 'node-forge';

// encryption (RSA-OAEP)
export async function rsaEncrypt(publicKeyPem, message) {
    return new Promise((resolve, reject) => {
        try {
            const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
            const buffer = forge.util.createBuffer(message, 'utf8');
            
            // RSA-OAEP with SHA-256
            const encrypted = publicKey.encrypt(buffer.getBytes(), 'RSA-OAEP', {
                md: forge.md.sha256.create(),
                mgf1: { md: forge.md.sha256.create() }
            });

            resolve(forge.util.encode64(encrypted));
        } catch (e) {
            reject(new Error("Encryption Failed: " + e.message));
        }
    });
}

// decryption (RSA-OAEP)
export async function rsaDecrypt(privateKeyPem, ciphertextBase64) {
    return new Promise((resolve, reject) => {
        try {
            const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
            const encryptedBytes = forge.util.decode64(ciphertextBase64);

            // RSA-OAEP with SHA-256
            const decrypted = privateKey.decrypt(encryptedBytes, 'RSA-OAEP', {
                md: forge.md.sha256.create(),
                mgf1: { md: forge.md.sha256.create() }
            });

            resolve(decrypted);
        } catch (e) {
            reject(new Error("Decryption Failed: Check your Private Key or Ciphertext."));
        }
    });
}

// sign (RSASSA-PKCS1-v1_5)
export async function rsaSign(privateKeyPem, message) {
    return new Promise((resolve, reject) => {
        try {
            const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
            const md = forge.md.sha256.create();
            md.update(message, 'utf8');

            const signature = privateKey.sign(md);
            resolve(forge.util.encode64(signature));
        } catch (e) {
            reject(new Error("Signing Failed: " + e.message));
        }
    });
}

// verify (RSASSA-PKCS1-v1_5)
export async function rsaVerify(publicKeyPem, signatureBase64, message) {
    return new Promise((resolve, reject) => {
        try {
            const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
            const md = forge.md.sha256.create();
            md.update(message, 'utf8');
            
            const signatureBytes = forge.util.decode64(signatureBase64);
            const verified = publicKey.verify(md.digest().bytes(), signatureBytes);

            resolve(verified);
        } catch (e) {
            // format error
            reject(new Error("Verification Error: " + e.message));
        }
    });
}