import Papa from 'papaparse';

/**
 * converts CSV string to JSON object/string.
 * @param {string} csvString - raw CSV content.
 * @returns {string} - JSON string
 */
export function csvToJson(csvString) {
    return new Promise((resolve, reject) => {
        Papa.parse(csvString, {
            header: true,      // first row is keys
            skipEmptyLines: true,
            dynamicTyping: true, // auto convert numbers/booleans
            complete: (results) => {
                if (results.errors.length > 0) {
                    reject(new Error("CSV Parsing Error: " + results.errors[0].message));
                } else {
                    resolve(JSON.stringify(results.data, null, 4));
                }
            },
            error: (err) => {
                reject(err);
            }
        });
    });
}

/**
 * vonverts JSON  to CSV
 * @param {string} jsonString - raw JSON content.
 * @returns {string} - CSV string.
 */
export function jsonToCsv(jsonString) {
    try {
        let data;
        // parse if it's a string, else assume object
        if (typeof jsonString === 'string') {
            data = JSON.parse(jsonString);
        } else {
            data = jsonString;
        }

        // ensure data is an array for CSV conversion
        if (!Array.isArray(data)) {
            // handle single object case or nested structure
            // wrap single object in array
            data = [data];
        }

        const csv = Papa.unparse(data, {
            quotes: false, // quote strings
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\r\n",
            skipEmptyLines: true
        });

        return csv;

    } catch (e) {
        throw new Error("JSON Parsing Error: Invalid JSON format.");
    }
}