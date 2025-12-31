/**
 * Shannon entropy calculator
 * calculates the randomness of a string's byte sequence.
 */
export function calculateEntropy(text) {
    if (!text) {
        return { entropy: 0, distribution: [], totalBytes: 0 };
    }

    // text to utf-8 bytes conversion
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const total = data.length;

    // count byte frequencies
    const frequencies = {};
    for (const byte of data) {
        frequencies[byte] = (frequencies[byte] || 0) + 1;
    }

    // calculate entropy
    let entropy = 0;
    const distribution = [];

    for (const byteStr in frequencies) {
        const byte = parseInt(byteStr);
        const count = frequencies[byteStr];
        const p = count / total;
        
        // Shannon entropy formula: H = -sum(p * log2(p))
        entropy -= p * Math.log2(p);

        distribution.push({
            byte: byte,
            hex: '0x' + byte.toString(16).toUpperCase().padStart(2, '0'),
            char: getPrintableChar(byte),
            count: count,
            probability: p
        });
    }

    // sort by byte value (0-255) for the histogram
    distribution.sort((a, b) => a.byte - b.byte);

    return {
        entropy: entropy,
        distribution: distribution,
        totalBytes: total
    };
}

// safely display byte characters
function getPrintableChar(byte) {
    if (byte >= 32 && byte <= 126) {
        return String.fromCharCode(byte);
    }
    return '.'; // non-printable
}