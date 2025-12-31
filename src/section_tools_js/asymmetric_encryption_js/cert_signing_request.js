import forge from 'node-forge';

/**
 * generates an RSA Private Key and a Certificate Signing Request (CSR).
 * @param {Object} details - CSR fields
 * @returns {Promise<Object>} - { privateKey, csr } in PEM format.
 */
export async function generateCSR(details) {
    return new Promise((resolve, reject) => {
        try {
            const keys = forge.pki.rsa.generateKeyPair(2048);

            const csr = forge.pki.createCertificationRequest();
            csr.publicKey = keys.publicKey;

            csr.setSubject([
                { name: 'commonName', value: details.commonName },
                { name: 'countryName', value: details.country },
                { name: 'stateOrProvinceName', value: details.state },
                { name: 'localityName', value: details.locality },
                { name: 'organizationName', value: details.organization },
                { name: 'organizationalUnitName', value: details.orgUnit }
            ]);

            csr.sign(keys.privateKey, forge.md.sha256.create());

            let privateKeyPem;
            if (details.passphrase) {
                privateKeyPem = forge.pki.encryptRsaPrivateKey(
                    keys.privateKey, 
                    details.passphrase, 
                    { algorithm: 'aes256' }
                );
            } else {
                privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
            }

            // CSR to PEM conversion
            const csrPem = forge.pki.certificationRequestToPem(csr);

            resolve({
                privateKey: privateKeyPem,
                csr: csrPem
            });

        } catch (err) {
            reject(new Error("Error: " + err.message));
        }
    });
}
