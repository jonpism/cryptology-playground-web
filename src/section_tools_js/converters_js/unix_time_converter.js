/**
 * converts Unix Timestamp to date string and vice versa.
 * @param {string} input - input string.
 * @param {string} mode - 'human2unix' or 'unix2human'.
 */
export function processUnixTime(input, mode) {
    if (!input) return "";

    if (mode === 'human2unix') {
        return dateToUnix(input);
    } else {
        return unixToDate(input);
    }
}

/**
 * human date to Unix timestamp (seconds)
 * accepts standard ISO format: YYYY-MM-DDTHH:mm:ss
 */
function dateToUnix(dateStr) {
    // JavaScript Date constructor parses ISO strings automatically
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
        throw new Error("Invalid Date format.");
    }

    // getTime() returns milliseconds, divide by 1000 for standard Unix Time
    return Math.floor(date.getTime() / 1000).toString();
}

/**
 * Unix Timestamp to Human Date
 */
function unixToDate(timestampStr) {
    const cleanTs = timestampStr.trim();
    
    if (!/^-?\d+$/.test(cleanTs)) {
        throw new Error("Invalid Timestamp. Must be an integer.");
    }

    // handle seconds vs milliseconds
    // if length is > 11, it's likely milliseconds (Java/JS style), otherwise seconds (Unix/Python style)
    let ts = Number(cleanTs);
    let isMillis = false;
    
    if (cleanTs.length > 11) {
        // assume milliseconds
        isMillis = true;
    } else {
        // assume seconds -> convert to milliseconds for JS
        ts *= 1000;
    }

    const date = new Date(ts);

    const utc = date.toUTCString();
    const local = date.toLocaleString();

    return `UTC:   ${utc}\nLocal: ${local} ${isMillis ? '(Input was Milliseconds)' : ''}`;
}