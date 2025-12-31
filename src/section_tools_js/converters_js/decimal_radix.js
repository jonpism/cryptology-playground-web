/**
 * converts Decimal to any Base (2-36) and vice-versa.
 * uses BigInt for arbitrary precision (handling very large numbers).
 * @param {string} input - input number string.
 * @param {number|string} base - target base (2-36).
 * @param {string} mode - 'dec2radix' or 'radix2dec'.
 */
export function processRadix(input, base, mode) {
    if (!input) return "";

    const radix = Number(base);
    if (isNaN(radix) || radix < 2 || radix > 36) {
        throw new Error("Base must be an integer between 2 and 36.");
    }
    
    // remove spaces/commas
    const cleanInput = input.trim().replace(/[\s,]/g, '');

    if (mode === 'dec2radix') {
        return decimalToRadix(cleanInput, radix);
    } else {
        return radixToDecimal(cleanInput, radix);
    }
}

/**
 * decimal (Base-10) to Base (2-36)
 */
function decimalToRadix(decimalStr, base) {
    try {
        const bigVal = BigInt(decimalStr);
        // BigInt.toString(radix) is supported natively in modern JS
        // toUpperCase() to standardize output
        return bigVal.toString(base).toUpperCase();
    } catch (e) {
        throw new Error("Invalid Decimal Number.");
    }
}

/**
 * Base (2-36) to Decimal (Base-10)
 */
function radixToDecimal(radixStr, base) {
    // check for negative numbers
    let isNegative = false;
    let str = radixStr;
    if (str.startsWith('-')) {
        isNegative = true;
        str = str.substring(1);
    }

    const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, base);
    const regex = new RegExp(`^[${validChars}]+$`, 'i');
    
    if (!regex.test(str)) {
        throw new Error(`Invalid digit found for Base-${base}. Allowed: 0-${validChars[validChars.length-1]}`);
    }

    // val = d0 * base^0 + d1 * base^1 ...
    // result = result * base + digit_val
    let result = 0n;
    const bigBase = BigInt(base);

    for (const char of str) {
        const digitVal = BigInt(parseInt(char, 36)); // parseInt handles 0-9 and A-Z correctly
        result = result * bigBase + digitVal;
    }

    if (isNegative) result = -result;

    // return with commas for readability
    return result.toLocaleString('en-US');
}