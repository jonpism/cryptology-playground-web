import * as openpgp from 'openpgp';

/**
 * encrypts file using a Public Key
 * @param {Uint8Array} fileBytes - raw bytes of the file to encrypt
 * @param {string} publicKeyArmored - ASCII armored Public Key string
 * @returns {Promise<string>} - encrypted data as an ASCII Armored string
 */
export async function encryptFile(fileBytes, publicKeyArmored) {
    try {
        // read public key
        const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

        // create message object
        // support all file types (images, pdf)
        const message = await openpgp.createMessage({ binary: fileBytes });

        // encrypt
        const encrypted = await openpgp.encrypt({
            message,
            encryptionKeys: publicKey,
            format: 'armored' // -----BEGIN PGP MESSAGE-----
        });

        return encrypted;
    } catch (err) {
        throw new Error(`Encryption failed: ${err.message}`);
    }
}

/**
 * decrypts file using Private Key
 * @param {string|Uint8Array} encryptedData - encrypted file content
 * @param {string} privateKeyArmored - ASCII armored Private Key string
 * @param {string} passphrase - password for the private key (if needed)
 * @returns {Promise<Uint8Array>} - decrypted raw file bytes.
 */
export async function decryptFile(encryptedData, privateKeyArmored, passphrase = '') {
    try {
        // read private key
        let privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });

        // unlock the key if it is encrypted
        if (!privateKey.isDecrypted()) {
            if (!passphrase) {
                throw new Error("Private key is encrypted. Please enter a passphrase.");
            }
            try {
                privateKey = await openpgp.decryptKey({
                    privateKey,
                    passphrase
                });
            } catch (e) {
                throw new Error("Incorrect passphrase for private key.");
            }
        }

        // parse the message
        let message;
        try {
            // text reading
            const textDecoder = new TextDecoder();
            const textStr = typeof encryptedData === 'string' ? encryptedData : textDecoder.decode(encryptedData);
            
            if (textStr.includes('-----BEGIN PGP MESSAGE-----')) {
                message = await openpgp.readMessage({ armoredMessage: textStr });
            } else {
                throw new Error('Not text');
            }
        } catch (e) {
            // binary reading
            message = await openpgp.readMessage({ binaryMessage: encryptedData });
        }

        // decrypt
        const { data: decryptedBytes } = await openpgp.decrypt({
            message,
            decryptionKeys: privateKey,
            format: 'binary'
        });

        return decryptedBytes;
    } catch (err) {
        throw new Error(`Decryption failed: ${err.message}`);
    }
}