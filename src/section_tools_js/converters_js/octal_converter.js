/**
 * decimal integers to Octal and vice-versa.
 * @param {string} input - input number string.
 * @param {string} mode - 'dec2oct' or 'oct2dec'.
 */
export function processOctal(input, mode) {
    if (!input) return "";
    
    // remove spaces and commas
    const cleanInput = input.trim().replace(/[\s,]/g, '');

    if (mode === 'dec2oct') {
        return decimalToOctal(cleanInput);
    } else {
        return octalToDecimal(cleanInput);
    }
}

function decimalToOctal(decimalStr) {
    try {
        const bigVal = BigInt(decimalStr);
        // convert to Base-8
        return bigVal.toString(8);
    } catch (e) {
        throw new Error("Invalid Decimal Number. Please enter integers only.");
    }
}

function octalToDecimal(octalStr) {
    // octal only allows digits 0-7
    if (!/^-?[0-7]+$/.test(octalStr)) {
        throw new Error("Invalid Octal. Only digits 0-7 are allowed.");
    }

    try {
        // '0o' to tell BigInt it is Octal
        const bigVal = BigInt("0o" + octalStr);
        
        // commas for readability
        return bigVal.toLocaleString('en-US');
    } catch (e) {
        throw new Error("Could not parse octal string.");
    }
}