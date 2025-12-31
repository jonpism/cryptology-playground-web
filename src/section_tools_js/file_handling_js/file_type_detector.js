import { detectFile } from 'file-type-checker';

/**
 * detects the file type using 'file-type-checker'.
 * @param {File} file - file to analyze.
 * @returns {Promise<Object>} - detection result.
 */
export async function detectFileType(file) {
    if (!file) throw new Error("No file provided.");

    // read the first 30,000 bytes
    const chunk = await readFileChunk(file, 30000); 
    
    // run detection
    const detected = detectFile(chunk);

    const result = {
        fileName: file.name,
        actualSize: file.size,
        claimedType: file.type || "Unknown",
        // normalize the library's output to match your UI's expectation
        matches: [] 
    };

    if (detected) {
        result.matches.push({
            name: detected.description || `${detected.extension.toUpperCase()} File`,
            ext: `.${detected.extension}`,
            mime: detected.mimeType
        });
    }

    return result;
}

/**
 * reads the first N bytes of a file.
 */
function readFileChunk(file, length) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // returns ArrayBuffer
        reader.onerror = () => reject(reader.error);
        const blob = file.slice(0, length);
        reader.readAsArrayBuffer(blob);
    });
}

// reuse the existing Hex Header
export async function getHexHeader(file) {
    const buffer = await readFileChunk(file, 16);
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
        .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
        .join(' ');
}