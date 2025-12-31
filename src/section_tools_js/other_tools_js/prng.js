export class PRNG {
    /**
     * @param {number} seed seed value.
     */
    constructor(seed) {
        this.m = 4294967296n; // 2^32
        this.a = 1664525n;
        this.c = 1013904223n;
        
        this.state = BigInt(seed);
    }

    /**
     * next pseudo-random integer.
     * @returns {number}
     */
    next() {
        this.state = (this.a * this.state + this.c) % this.m;
        return Number(this.state);
    }

    /**
     * next pseudo-random float [0, 1).
     * @returns {number}
     */
    random() {
        return this.next() / Number(this.m);
    }
}

// generate a sequence of numbers
export function generateSequence(seed, count) {
    if (isNaN(seed) || isNaN(count)) throw new Error("Invalid input.");
    
    const generator = new PRNG(seed);
    const integers = [];
    const floats = [];

    for (let i = 0; i < count; i++) {
        // generate the integer first, then calculate float from that state 
        // to match the logic of: float = next() / m
        const val = generator.next();
        integers.push(val);
        floats.push(val / 4294967296);
    }

    return { integers, floats };
}