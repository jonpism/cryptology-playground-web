// Miller-Rabin Primality Test
function isPrime(n, k = 10) {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n) return false;

    // n-1: d * 2^r
    let r = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
        d /= 2n;
        r += 1n;
    }

    for (let i = 0; i < k; i++) {
        // random 'a' in range [2, n-2]
        const a = BigInt(2) + bigIntRandom(n - 4n); 
        
        let x = modPow(a, d, n);
        if (x === 1n || x === n - 1n) continue;

        let continueWitnessLoop = false;
        for (let j = 0n; j < r - 1n; j++) {
            x = modPow(x, 2n, n);
            if (x === n - 1n) {
                continueWitnessLoop = true;
                break;
            }
        }
        
        if (continueWitnessLoop) continue;
        return false; // composite
    }
    return true; // prime
}

// modular exponentiation: (base^exp) % mod
function modPow(base, exp, mod) {
    let res = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % mod;
        base = (base * base) % mod;
        exp /= 2n;
    }
    return res;
}

// generate random BigInt < limit
function bigIntRandom(limit) {
    // bit length of limit
    const bits = limit.toString(2).length;
    let result;
    do {
        // generate random bits
        let hex = "";
        const bytes = Math.ceil(bits / 8);
        const array = new Uint8Array(bytes);
        window.crypto.getRandomValues(array);
        for(let b of array) hex += b.toString(16).padStart(2,'0');
        
        result = BigInt("0x" + hex);
        
    } while (result >= limit);
    return result;
}

// generate random candidate of specific bit length
function generateCandidate(bitLength) {
    // random bits
    const bytes = Math.ceil(bitLength / 8);
    const array = new Uint8Array(bytes);
    window.crypto.getRandomValues(array);
    
    // ensure odd and correct bit length
    let hex = "";
    for(let b of array) hex += b.toString(16).padStart(2,'0');
    let n = BigInt("0x" + hex);
    
    // set MSB
    const msb = 1n << BigInt(bitLength - 1);
    n |= msb;
    
    // set LSB
    n |= 1n;
    
    // trim if we exceeded bit length
    const mask = (1n << BigInt(bitLength)) - 1n;
    n &= mask;
    
    n |= msb;

    return n;
}

/**
 * generate N primes of specific bit length
 */
export async function generatePrimes(count, bitLength) {
    const primes = [];
    const maxAttempts = 1000 * count; // safety break
    let attempts = 0;

    while (primes.length < count && attempts < maxAttempts) {
        attempts++;
        const candidate = generateCandidate(bitLength);
        
        if (isPrime(candidate)) {
            primes.push(candidate.toString());
        }
        
        // prevent freezing on large bits
        if (attempts % 10 === 0) {
            await new Promise(r => setTimeout(r, 0));
        }
    }
    
    if (primes.length < count) {
        throw new Error("Timeout: Could not generate enough primes in time.");
    }
    
    return primes;
}