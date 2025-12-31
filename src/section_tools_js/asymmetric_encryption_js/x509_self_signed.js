import forge from 'node-forge';

/**
 * generates a Self-Signed X.509 Certificate.
 * @param {Object} data - commonName, organization, etc.
 */
export async function generateSelfSignedCert(data) {
    return new Promise((resolve, reject) => {
        try {
            // generate RSA key pair
            // 2048 bits is standard for browser performance. 
            // 4096 bits in pure JS takes longer
            forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, keys) => {
                if (err) return reject(new Error("Key Generation Error: " + err.message));

                const { privateKey, publicKey } = keys;

                // create certificate
                const cert = forge.pki.createCertificate();
                cert.publicKey = publicKey;
                
                // random serial number
                cert.serialNumber = forge.util.bytesToHex(forge.random.getBytesSync(16));
                
                // validity
                const validDays = parseInt(data.validDays) || 365;
                cert.validity.notBefore = new Date();
                cert.validity.notAfter = new Date();
                cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + validDays);

                // subject and issuer (same for self-signed)
                const attrs = [
                    { name: 'commonName', value: data.commonName },
                    { name: 'countryName', value: data.country },
                    { name: 'stateOrProvinceName', value: data.state },
                    { name: 'localityName', value: data.locality },
                    { name: 'organizationName', value: data.organization }
                ];

                // filter out empty attributes
                const validAttrs = attrs.filter(a => a.value && a.value.trim() !== "");

                cert.setSubject(validAttrs);
                cert.setIssuer(validAttrs);

                // extensions
                const extensions = [
                    {
                        name: 'basicConstraints',
                        cA: true // self signed is usually a Root CA for local dev
                    },
                    {
                        name: 'keyUsage',
                        keyCertSign: true,
                        digitalSignature: true,
                        cRLSign: true
                    }
                ];

                // handle SANs (Subject Alternative Names)
                if (data.sanNames && data.sanNames.length > 0) {
                    const altNames = data.sanNames.map(name => {
                        // check if IP or DNS
                        const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(name);
                        return {
                            type: isIP ? 7 : 2, // 7 = IP, 2 = DNS
                            ip: isIP ? name : undefined,
                            value: isIP ? undefined : name
                        };
                    });
                    
                    extensions.push({
                        name: 'subjectAltName',
                        altNames: altNames
                    });
                }

                cert.setExtensions(extensions);

                // sign certificate (SHA-512)
                cert.sign(privateKey, forge.md.sha512.create());

                // export to PEM
                const certPem = forge.pki.certificateToPem(cert);
                const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
                let privateKeyPem;

                // encrypt prv key if passphrase provided
                if (data.passphrase) {
                    privateKeyPem = forge.pki.encryptRsaPrivateKey(
                        privateKey, 
                        data.passphrase, 
                        { algorithm: 'aes256' }
                    );
                } else {
                    privateKeyPem = forge.pki.privateKeyToPem(privateKey);
                }

                resolve({
                    certificate: certPem,
                    privateKey: privateKeyPem,
                    publicKey: publicKeyPem
                });
            });

        } catch (e) {
            reject(e);
        }
    });
}