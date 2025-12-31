import { inputEncoding } from '../helpers/inputEncoding';

/**
 * generates a Hexdump from text or binary data.
 * @param {string|Uint8Array} input - input data.
 * @param {number} width - num of bytes per line (default 16).
 * @param {string} encoding - utf-8, hex, etc.
 */
export function processHexdump(input, width = 16, encoding = 'utf-8') {
    if (!input) return "";

    // data as Uint8Array (bytes)
    let data;
    if (input instanceof Uint8Array) {
        data = input;
    } else {
        try {
            data = inputEncoding(input, encoding);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    // generate dump line by line
    const result = [];
    const hexWidth = width * 3 - 1; // 2 chars for hex + 1 space per byte, minus trailing space

    for (let offset = 0; offset < data.length; offset += width) {
        // get the chunk
        const chunk = data.slice(offset, offset + width);
        
        // generate Hex part
        const hexBytes = Array.from(chunk)
            .map(b => b.toString(16).padStart(2, '0'))
            .join(' ');
        
        // pad hex part
        const hexPadded = hexBytes.padEnd(hexWidth, ' ');

        // generate ASCII part
        // replace non-printable chars with dots
        const asciiPart = Array.from(chunk)
            .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
            .join('');

        // format offset (8 chars hex)
        const offsetHex = offset.toString(16).padStart(8, '0');

        // Offset  Hex   |ASCII|
        result.push(`${offsetHex}  ${hexPadded}  |${asciiPart}|`);
    }

    return result.join('\n');
}