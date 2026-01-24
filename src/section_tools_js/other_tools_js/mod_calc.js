/**
 * num a mod n (handling negatives correctly)
 * @param {number|bigint} a - number
 * @param {number|bigint} n - modulus
 * @returns {bigint} - result in range [0, n-1]
 */
export function mod(a, n) {
    if (n === 0) throw new Error("Modulus cannot be zero");
    
    // BigInt for safety with large numbers
    const bigA = BigInt(a);
    const bigN = BigInt(n);

    // fix Javascript % operator returns negative values for negative inputs
    // by adding n and modding again: ((a % n) + n) % n
    return ((bigA % bigN) + bigN) % bigN;
}

/**
 * Extended Euclidean Algorithm to find GCD and coefficients (x, y)
 * ax + by = gcd(a, b)
 */
export function extendedGCD(a, b) {
    let old_r = BigInt(a), r = BigInt(b);
    let old_s = 1n, s = 0n;
    let old_t = 0n, t = 1n;

    while (r !== 0n) {
        const quotient = old_r / r;
        
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
        [old_t, t] = [t, old_t - quotient * t];
    }

    return {
        gcd: old_r,
        x: old_s,
        y: old_t
    };
}

/**
 * modular inverse of a mod m
 * (a * x) ≡ 1 (mod m)
 */
export function modInverse(a, m) {
    const { gcd, x } = extendedGCD(a, m);
    
    if (gcd !== 1n) {
        throw new Error(`Inverse does not exist (gcd(${a}, ${m}) != 1)`);
    }

    // positive result
    return ((x % BigInt(m)) + BigInt(m)) % BigInt(m);
}