/**
 * RSA Wiener's Attack Implementation
 * Recover private key 'd' from (e, N) when d is small.
 */

// BigInt Square Root Helper
function isqrt(n) {
    if (n < 0n) throw new Error("Negative number");
    if (n < 2n) return n;
    let x = n;
    let y = (x + 1n) / 2n;
    while (y < x) {
        x = y;
        y = (x + n / x) / 2n;
    }
    return x;
}

/**
 * 1. Generate Continued Fraction expansion of e/N
 */
function continuedFraction(e, n) {
    const output = [];
    let a = e;
    let b = n;
    
    // Safety break to prevent browser hang on weird inputs
    let safeGuard = 0;
    while (b > 0n && safeGuard < 10000) {
        const q = a / b;
        const r = a % b;
        output.push(q);
        a = b;
        b = r;
        safeGuard++;
    }
    return output;
}

/**
 * 2. Compute Convergents from Continued Fraction
 * These are the candidates for k/d
 */
function computeConvergents(cf) {
    const convergents = [];
    let h1 = 1n, h2 = 0n;
    let k1 = 0n, k2 = 1n;

    for (const a of cf) {
        const h = a * h1 + h2;
        const k = a * k1 + k2;
        
        convergents.push({ k: h, d: k }); // In Wiener notation: k/d = convergent
        
        h2 = h1; h1 = h;
        k2 = k1; k1 = k;
    }
    return convergents;
}

/**
 * Main Attack Function
 * @param {string} eStr - Public Exponent
 * @param {string} nStr - Modulus
 */
export function executeWienerAttack(eStr, nStr) {
    try {
        const e = BigInt(eStr);
        const n = BigInt(nStr);

        // 1. Get Continued Fractions
        const cf = continuedFraction(e, n);

        // 2. Get Convergents
        const convergents = computeConvergents(cf);

        // 3. Test each convergent
        let foundD = null;
        let foundPhi = null;
        let foundP = null;
        let foundQ = null;

        for (const conv of convergents) {
            const k = conv.k;
            const d = conv.d;

            if (k === 0n) continue;

            // Check: phi = (ed - 1) / k must be an integer
            const edMinus1 = e * d - 1n;
            if (edMinus1 % k !== 0n) continue;

            const phi = edMinus1 / k;

            // Solve Quadratic Equation: x^2 - ((N - phi) + 1)x + N = 0
            // Roots are p and q
            const b = -(n - phi + 1n);
            const discriminant = b * b - 4n * n;

            if (discriminant >= 0n) {
                const root = isqrt(discriminant);
                // Check if perfect square
                if (root * root === discriminant) {
                    const root1 = (-b + root) / 2n;
                    const root2 = (-b - root) / 2n;

                    // Final Check: p * q == N
                    if (root1 * root2 === n) {
                        foundD = d;
                        foundPhi = phi;
                        foundP = root1;
                        foundQ = root2;
                        break; // Found it!
                    }
                }
            }
        }

        return {
            success: !!foundD,
            continuedFractions: cf.map(x => x.toString()),
            convergents: convergents.map(c => ({ k: c.k.toString(), d: c.d.toString() })),
            d: foundD ? foundD.toString() : null,
            phi: foundPhi ? foundPhi.toString() : null,
            p: foundP ? foundP.toString() : null,
            q: foundQ ? foundQ.toString() : null
        };

    } catch (e) {
        throw new Error(e.message || "Invalid Input");
    }
}