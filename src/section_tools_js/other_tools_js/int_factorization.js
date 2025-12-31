// greatest common divisor
function gcd(a, b) {
    while (b > 0n) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
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

// Miller-Rabin primality test
// validates if a number is prime
function isPrime(n) {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;

    // n-1: d * 2^r
    let d = n - 1n;
    let r = 0n;
    while (d % 2n === 0n) {
        d /= 2n;
        r += 1n;
    }

    const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n];
    
    for (const a of bases) {
        if (n <= a) break;
        let x = modPow(a, d, n);
        if (x === 1n || x === n - 1n) continue;
        
        let continueLoop = false;
        for (let i = 0n; i < r - 1n; i++) {
            x = (x * x) % n;
            if (x === n - 1n) {
                continueLoop = true;
                break;
            }
        }
        if (continueLoop) continue;
        return false;
    }
    return true;
}

// Pollard's Rho algorithm
// finds a non-trivial factor of n
function pollardsRho(n) {
    if (n % 2n === 0n) return 2n;
    
    let x = BigInt(Math.floor(Math.random() * 100)) + 2n;
    let y = x;
    let c = BigInt(Math.floor(Math.random() * 100)) + 1n;
    let d = 1n;
    
    const f = (val) => (val * val + c) % n;

    while (d === 1n) {
        x = f(x);
        y = f(f(y));
        
        let diff = x > y ? x - y : y - x;
        d = gcd(diff, n);
        
        // if failed, retry with different params
        if (d === n) {
             return pollardsRho(n);
        }
    }
    return d;
}

/**
 * factorization function
 * @param {string} numberStr - number to factorize as a string.
 * @returns {object} - dictionary
 */
export function factorizeInteger(numberStr) {
    if (!/^\d+$/.test(numberStr)) throw new Error("Invalid integer input.");
    
    let n = BigInt(numberStr);
    const factors = {};

    if (n <= 0n) throw new Error("Number must be > 0");
    if (n === 1n) return { "1": 1 };

    // to record factor
    const addFactor = (f) => {
        const key = f.toString();
        factors[key] = (factors[key] || 0) + 1;
    };

    // trial division for small primes
    while (n % 2n === 0n) {
        addFactor(2n);
        n /= 2n;
    }
    
    while (n % 3n === 0n) {
        addFactor(3n);
        n /= 3n;
    }

    // queue for composite numbers we need to break down
    const queue = [];
    if (n > 1n) queue.push(n);

    // process queue with Pollard's Rho
    let iter = 0;
    const MAX_ITER = 10000; 

    while (queue.length > 0) {
        if (iter++ > MAX_ITER) throw new Error("Calculation timed out (Number too complex).");
        
        let current = queue.pop();
        
        if (isPrime(current)) {
            addFactor(current);
            continue;
        }
        
        // find a factor
        let factor = pollardsRho(current);
        
        queue.push(factor);
        queue.push(current / factor);
    }
    
    return factors;
}

// format the result string
export function formatFactorization(factors) {
    return Object.entries(factors)
        .sort((a, b) => {
            // sort by base
            const diff = BigInt(a[0]) - BigInt(b[0]);
            return diff > 0n ? 1 : diff < 0n ? -1 : 0;
        })
        .map(([base, exp]) => exp > 1 ? `${base}^${exp}` : `${base}`)
        .join(' * ');
}