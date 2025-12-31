const BASE = 36;
const TMIN = 1;
const TMAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;
const DELIMITER = '-';

/**
 * unicode to punycode and vice versa.
 * @param {string} input - input string.
 * @param {string} mode - 'encode' or 'decode'.
 */
export function processPunycode(input, mode) {
    if (!input) return "";

    if (mode === 'encode') {
        return encode(input);
    } else {
        return decode(input);
    }
}

function encode(input) {
    let output = [];
    
    input = String(input);
    let inputLength = input.length;
    let n = INITIAL_N;
    let delta = 0;
    let bias = INITIAL_BIAS;

    for (let char of input) {
        if (char.charCodeAt(0) < 128) {
            output.push(char);
        }
    }

    let basicLength = output.length;
    let handledCPCount = basicLength;

    if (basicLength > 0) {
        output.push(DELIMITER);
    }

    while (handledCPCount < inputLength) {
        let m = Number.MAX_SAFE_INTEGER;
        
        // next smallest code point >= n
        for (let char of input) {
            let cp = char.codePointAt(0);
            if (cp >= n && cp < m) {
                m = cp;
            }
        }

        delta += (m - n) * (handledCPCount + 1);
        n = m;

        for (let char of input) {
            let cp = char.codePointAt(0);
            if (cp < n) {
                delta++;
            } else if (cp === n) {
                let q = delta;
                for (let k = BASE; ; k += BASE) {
                    let t = k <= bias ? TMIN : (k >= bias + TMAX ? TMAX : k - bias);
                    if (q < t) break;
                    output.push(String.fromCharCode(digitToBasic(t + (q - t) % (BASE - t), 0)));
                    q = Math.floor((q - t) / (BASE - t));
                }
                output.push(String.fromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCount + 1, handledCPCount === basicLength);
                delta = 0;
                handledCPCount++;
            }
        }
        delta++;
        n++;
    }

    return "xn--" + output.join("");
}

function decode(input) {
    // remove "xn--" prefix
    if (input.startsWith("xn--")) {
        input = input.substring(4);
    }

    let output = [];
    let inputLength = input.length;
    let i = 0;
    let n = INITIAL_N;
    let bias = INITIAL_BIAS;

    let delimiterIndex = input.lastIndexOf(DELIMITER);
    if (delimiterIndex > 0) {
        for (let j = 0; j < delimiterIndex; j++) {
            let char = input.charCodeAt(j);
            if (char >= 128) throw new Error("Invalid input: Non-basic character found");
            output.push(char);
        }
        i = delimiterIndex + 1;
    }

    while (i < inputLength) {
        let oldi = i;
        let w = 1;
        for (let k = BASE; ; k += BASE) {
            if (i >= inputLength) throw new Error("Invalid input: Incomplete sequence");
            let digit = basicToDigit(input.charCodeAt(i++));
            if (digit >= BASE) throw new Error("Invalid input: Invalid character");
            if (digit > Math.floor((Number.MAX_SAFE_INTEGER - i) / w)) throw new Error("Overflow");
            i += digit * w; // delta logic
            let t = k <= bias ? TMIN : (k >= bias + TMAX ? TMAX : k - bias);
            if (digit < t) break;
            w *= BASE - t;
        }

        let outLen = output.length + 1;
        bias = adapt(i - oldi, outLen, oldi === 0);
        
        if (Math.floor(i / outLen) > Number.MAX_SAFE_INTEGER - n) throw new Error("Overflow");
        n += Math.floor(i / outLen);
        i %= outLen;
        
        // n at position i
        output.splice(i, 0, n);
        i++;
    }

    return String.fromCodePoint(...output);
}

function adapt(delta, numPoints, firstTime) {
    delta = firstTime ? Math.floor(delta / DAMP) : Math.floor(delta / 2);
    delta += Math.floor(delta / numPoints);
    let k = 0;
    while (delta > ((BASE - TMIN) * TMAX) / 2) {
        delta = Math.floor(delta / (BASE - TMIN));
        k += BASE;
    }
    return Math.floor(k + ((BASE - TMIN + 1) * delta) / (delta + SKEW));
}

function digitToBasic(digit, flag) {
    // 0..25 -> a..z, 26..35 -> 0..9
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
}

function basicToDigit(code) {
    if (code >= 48 && code <= 57) return code - 22; // 0..9
    if (code >= 65 && code <= 90) return code - 65; // A..Z
    if (code >= 97 && code <= 122) return code - 97; // a..z
    return BASE;
}