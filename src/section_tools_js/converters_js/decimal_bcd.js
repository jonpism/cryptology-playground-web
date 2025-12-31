/**
 * converts decimal to BCD and vice versa.
 * @param {string} input - input string.
 * @param {string} mode - 'dec2bcd' or 'bcd2dec'.
 */
export function processBCD(input, mode) {
    if (!input) return "";

    const cleanInput = input.trim();

    if (mode === 'dec2bcd') {
        return decimalToBCD(cleanInput);
    } else {
        return bcdToDecimal(cleanInput);
    }
}

/**
 * Decimal to BCD
 */
function decimalToBCD(decimalStr) {
    // only digits allowed
    if (!/^\d+$/.test(decimalStr)) {
        throw new Error("Invalid Decimal. Please enter digits 0-9 only.");
    }

    // process each digit individually
    const digits = decimalStr.split('');
    const bcdParts = digits.map(digit => {
        const val = parseInt(digit, 10);
        // convert to 4-bit binary
        return val.toString(2).padStart(4, '0');
    });

    return bcdParts.join(' ');
}

/**
 * BCD to Decimal
 */
function bcdToDecimal(bcdStr) {
    // 1. Split by spaces or any whitespace
    const groups = bcdStr.trim().split(/\s+/);

    let resultDigits = "";

    for (const group of groups) {
        // must be binary
        if (!/^[01]+$/.test(group)) {
            throw new Error(`Invalid binary group found: "${group}"`);
        }

        // parse binary to integer
        const val = parseInt(group, 2);

        // in standard 8421 BCD, a nibble cannot exceed 9 (1001)
        // 1010 (10) through 1111 (15) are invalid.
        if (val > 9) {
            throw new Error(`Invalid BCD sequence: "${group}" evaluates to ${val}, which is not a digit (0-9).`);
        }

        resultDigits += val.toString();
    }

    return resultDigits;
}