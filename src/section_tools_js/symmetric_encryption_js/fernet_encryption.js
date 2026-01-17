import fernet from 'fernet';

/**
 * generates random 32-byte URL-safe key
 */
export function generateFernetKey() {
    // generate 32 random bytes
    const randomValues = new Uint8Array(32);
    window.crypto.getRandomValues(randomValues);
    
    // convert to String
    let binaryString = "";
    for (let i = 0; i < randomValues.length; i++) {
        binaryString += String.fromCharCode(randomValues[i]);
    }
    
    // URL-safe
    return window.btoa(binaryString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * encrypt message 
 */
export function encryptFernet(text, secretKey) {
    try {
        const secret = new fernet.Secret(secretKey);
        
        // create a Token
        const token = new fernet.Token({
            secret: secret,
            ttl: 0
        });
        
        return token.encode(text);
    } catch (err) {
        throw new Error("Encryption failed. Check your key format.");
    }
}

/**
 * decryption
 */
export function decryptFernet(tokenString, secretKey) {
    try {
        const secret = new fernet.Secret(secretKey);
        
        const token = new fernet.Token({
            secret: secret,
            token: tokenString,
            ttl: 0
        });
        
        const decoded = token.decode();
        
        if (!decoded) {
            throw new Error("Invalid Token or Key");
        }
        
        return decoded;
    } catch (err) {
        throw new Error("Decryption failed. Ensure the key matches and the text is a valid Fernet token.");
    }
}