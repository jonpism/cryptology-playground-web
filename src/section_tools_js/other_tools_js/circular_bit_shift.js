// get a bitmask for a specific width
function getMask(bitWidth) {
    return (1n << BigInt(bitWidth)) - 1n;
}

/**
 * Circular Left Shift (ROL)
 * @param {number|string} numberStr - number to rotate.
 * @param {number} shiftAmount - positions to shift.
 * @param {number} bitWidth - width of the binary representation
 * @returns {object} - decimal and binary result.
 */
export function circularLeftShift(numberStr, shiftAmount, bitWidth) {
    const num = BigInt(numberStr);
    const shift = BigInt(shiftAmount) % BigInt(bitWidth);
    const width = BigInt(bitWidth);
    const mask = getMask(width);

    // input within bit width
    const maskedNum = num & mask;

    // perform rotation
    let rotated = (maskedNum << shift) | (maskedNum >> (width - shift));
    
    // keep result within bit width
    rotated &= mask;

    return formatResult(rotated, width);
}

/**
 * Circular Right Shift (ROR)
 */
export function circularRightShift(numberStr, shiftAmount, bitWidth) {
    const num = BigInt(numberStr);
    const shift = BigInt(shiftAmount) % BigInt(bitWidth);
    const width = BigInt(bitWidth);
    const mask = getMask(width);

    const maskedNum = num & mask;

    // perform rotation
    let rotated = (maskedNum >> shift) | (maskedNum << (width - shift));
    
    rotated &= mask;

    return formatResult(rotated, width);
}

/**
 * format output
 */
function formatResult(bigIntValue, bitWidth) {
    return {
        decimal: bigIntValue.toString(),
        // pad binary output with leading zeros to match bit width
        binary: bigIntValue.toString(2).padStart(Number(bitWidth), '0')
    };
}