/**
 * converts decimal integers to Binary and vice-versa.
 * Uses BigInt to support large numbers (greater than 2^53).
 * @param {string} input - input number.
 * @param {string} mode - 'dec2bin' or 'bin2dec'.
 */
export function processDecimalBinary(input, mode) {
    if (!input) return "";
    
    // remove spaces/commas
    const cleanInput = input.trim().replace(/[\s,]/g, '');

    if (mode === 'dec2bin') {
        return decimalToBinary(cleanInput);
    } else {
        return binaryToDecimal(cleanInput);
    }
}

function decimalToBinary(decimalStr) {
    try {
        // use BigInt for arbitrary precision
        const bigVal = BigInt(decimalStr);
        return bigVal.toString(2);
    } catch (e) {
        throw new Error("Invalid Decimal Number. Please enter integers only.");
    }
}

function binaryToDecimal(binaryStr) {
    // only 0, 1, and optional negative sign are allowed
    if (!/^-?[01]+$/.test(binaryStr)) {
        throw new Error("Invalid Binary. Only 0 and 1 are allowed.");
    }

    try {
        // prefix with '0b' to tell BigInt it is binary
        const bigVal = BigInt("0b" + binaryStr);
        return bigVal.toString(10);
    } catch (e) {
        throw new Error("Could not parse binary string.");
    }
}