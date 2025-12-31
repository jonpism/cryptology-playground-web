/**
 * fast modular exponentiation
 */
function modPow(base, exp, mod) {
    let res = 1n;
    let b = base % mod;
    let e = exp;

    while (e > 0n) {
        // if exponent is odd, multiply result with base
        if (e % 2n === 1n) {
            res = (res * b) % mod;
        }
        // square the base
        b = (b * b) % mod;
        // divide exponent by 2
        e /= 2n;
    }
    return res;
}

/**
 * calculates Public keys and Shared Secret.
 * @param {string} gStr - generator (Base)
 * @param {string} pStr - prime (Modulus)
 * @param {string} aStr - Alice's Private Key
 * @param {string} bStr - Bob's Private Key
 */
export function calculateDiffieHellman(gStr, pStr, aStr, bStr) {
    if (!gStr || !pStr || !aStr || !bStr) {
        throw new Error("Please fill in all fields (Base, Modulus, Exponent A, Exponent B).");
    }

    try {
        const g = BigInt(gStr);
        const p = BigInt(pStr);
        const a = BigInt(aStr);
        const b = BigInt(bStr);

        // calculate Public Keys
        // Alice computes A = g^a mod p
        const alicePublic = modPow(g, a, p);
        
        // Bob computes B = g^b mod p
        const bobPublic = modPow(g, b, p);

        // calculate Shared Secrets
        // Alice computes S = B^a mod p
        const sharedKeyAlice = modPow(bobPublic, a, p);

        // Bob computes S = A^b mod p
        const sharedKeyBob = modPow(alicePublic, b, p);

        // verify
        const match = sharedKeyAlice === sharedKeyBob;

        return {
            alicePublic: alicePublic.toString(),
            bobPublic: bobPublic.toString(),
            sharedSecret: sharedKeyAlice.toString(),
            match: match
        };

    } catch (e) {
        if (e instanceof SyntaxError) { // BigInt parsing error
            throw new Error("Inputs must be valid integers.");
        }
        throw e;
    }
}