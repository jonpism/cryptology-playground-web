import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

/**
 * ChaCha20 core implementation
 */
class ChaCha20Core {
    constructor(key, nonce) {
        if (key.length !== 32) throw new Error("Key must be 32 bytes.");
        if (nonce.length !== 12) throw new Error("Nonce must be 12 bytes.");
        
        this.key = key;
        this.nonce = nonce;
        this.counter = 1; 
    }

    _quarterRound(x, a, b, c, d) {
        x[a] = (x[a] + x[b]) | 0; x[d] ^= x[a]; x[d] = (x[d] << 16) | (x[d] >>> 16);
        x[c] = (x[c] + x[d]) | 0; x[b] ^= x[c]; x[b] = (x[b] << 12) | (x[b] >>> 20);
        x[a] = (x[a] + x[b]) | 0; x[d] ^= x[a]; x[d] = (x[d] << 8)  | (x[d] >>> 24);
        x[c] = (x[c] + x[d]) | 0; x[b] ^= x[c]; x[b] = (x[b] << 7)  | (x[b] >>> 25);
    }

    _getKeyStreamBlock(counter) {
        const state = new Uint32Array(16);
        const k = new Uint32Array(this.key.buffer, this.key.byteOffset, 8);
        const n = new Uint32Array(this.nonce.buffer, this.nonce.byteOffset, 3);

        state[0] = 0x61707865; state[1] = 0x3320646e; state[2] = 0x79622d32; state[3] = 0x6b206574;
        state[4] = k[0]; state[5] = k[1]; state[6] = k[2]; state[7] = k[3];
        state[8] = k[4]; state[9] = k[5]; state[10] = k[6]; state[11] = k[7];
        state[12] = counter;
        state[13] = n[0]; state[14] = n[1]; state[15] = n[2];

        const work = new Uint32Array(state);

        for (let i = 0; i < 10; i++) {
            this._quarterRound(work, 0, 4, 8, 12);
            this._quarterRound(work, 1, 5, 9, 13);
            this._quarterRound(work, 2, 6, 10, 14);
            this._quarterRound(work, 3, 7, 11, 15);
            this._quarterRound(work, 0, 5, 10, 15);
            this._quarterRound(work, 1, 6, 11, 12);
            this._quarterRound(work, 2, 7, 8, 13);
            this._quarterRound(work, 3, 4, 9, 14);
        }

        const out = new Uint8Array(64);
        const out32 = new Uint32Array(out.buffer);
        for (let i = 0; i < 16; i++) {
            out32[i] = (work[i] + state[i]) | 0;
        }
        return out;
    }

    crypt(input) {
        const output = new Uint8Array(input.length);
        let count = this.counter;

        for (let i = 0; i < input.length; i += 64) {
            const keystream = this._getKeyStreamBlock(count++);
            const len = Math.min(64, input.length - i);
            for (let j = 0; j < len; j++) {
                output[i + j] = input[i + j] ^ keystream[j];
            }
        }
        return output;
    }
}

const toHex = (u8) => Array.from(u8).map(b => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex) => {
    const clean = hex.replace(/\s+/g, '');
    if (clean.length % 2 !== 0) throw new Error("Invalid Hex string.");
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) bytes[i/2] = parseInt(clean.substr(i, 2), 16);
    return bytes;
};

/**
 * main processor function
 * parsing, validation, execution.
 */
export function processChaCha20(text, keyStr, nonceStr, mode, format) {
    if (!keyStr) throw new Error("Key is required.");
    if (!nonceStr) throw new Error("Nonce is required.");

    // parse key & nonce
    let keyBytes, nonceBytes;

    try {
        keyBytes = fromHex(keyStr);
    } catch {
        // treat as UTF8 and pad/slice
        const tmp = naclUtil.decodeUTF8(keyStr);
        keyBytes = new Uint8Array(32);
        keyBytes.set(tmp.slice(0, 32));
    }

    try {
        nonceBytes = fromHex(nonceStr);
    } catch {
        const tmp = naclUtil.decodeUTF8(nonceStr);
        nonceBytes = new Uint8Array(12);
        nonceBytes.set(tmp.slice(0, 12));
    }

    if (keyBytes.length !== 32) throw new Error(`Key must be 32 bytes (got ${keyBytes.length}).`);
    if (nonceBytes.length !== 12) throw new Error(`Nonce must be 12 bytes (got ${nonceBytes.length}).`);

    // parse input
    let inputBytes;
    if (mode === 'encrypt') {
        inputBytes = naclUtil.decodeUTF8(text);
    } else {
        // parse based on format
        try {
            inputBytes = format === 'Base64' ? naclUtil.decodeBase64(text) : fromHex(text);
        } catch (e) {
            throw new Error(`Invalid ${format} input.`);
        }
    }

    // execute
    const cipher = new ChaCha20Core(keyBytes, nonceBytes);
    const outputBytes = cipher.crypt(inputBytes);

    if (mode === 'encrypt') {
        return format === 'Base64' ? naclUtil.encodeBase64(outputBytes) : toHex(outputBytes);
    } else {
        // handle binary garbage
        try {
            return naclUtil.encodeUTF8(outputBytes);
        } catch {
            return "Error: Decrypted data is not valid UTF-8 text.";
        }
    }
}

export function generateParams() {
    return {
        key: toHex(nacl.randomBytes(32)),
        nonce: toHex(nacl.randomBytes(12))
    };
}