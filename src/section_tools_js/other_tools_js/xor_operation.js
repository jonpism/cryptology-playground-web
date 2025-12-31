/**
 * XOR operation 
 * bitwise exclusive-OR on two binary strings.
 */
export function calculateXor(bin1, bin2) {
    if (!bin1 || !bin2) {
        throw new Error("Please provide both binary variables.");
    }
    
    // check for non-binary characters
    if (/[^01]/.test(bin1) || /[^01]/.test(bin2)) {
        throw new Error("Inputs must be binary strings (containing only 0 and 1).");
    }

    // align lengths: pad with zeros
    const maxLength = Math.max(bin1.length, bin2.length);
    const s1 = bin1.padStart(maxLength, '0');
    const s2 = bin2.padStart(maxLength, '0');

    let result = "";
    for (let i = 0; i < maxLength; i++) {
        result += (s1[i] !== s2[i]) ? "1" : "0";
    }

    return result;
}