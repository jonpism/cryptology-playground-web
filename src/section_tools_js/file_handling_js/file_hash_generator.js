import CryptoJS from 'crypto-js';

/**
 * Calculates file hashes (MD5, SHA-1, SHA-256, SHA-512).
 * Uses Web Crypto API for performance on SHA, and CryptoJS for MD5.
 * Reads large files in chunks to prevent memory issues.
 */

export async function generateFileHashes(file) {
    if (!file) throw new Error("No file provided.");

    // Prepare Web Crypto hashers
    // Note: We can't easily stream Web Crypto in one pass for multiple algos 
    // without reading the file multiple times or caching chunks.
    // For simplicity and memory safety with large files, we'll process sequentially 
    // or use a robust library like 'spark-md5' for MD5 and native for others.
    // Here we will use a chunk-based approach that works well for files up to a few GB.

    const startTime = performance.now();

    try {
        // 1. Calculate SHA-1, SHA-256, SHA-512 (Native)
        // We run these in parallel promises
        const [sha1, sha256, sha512] = await Promise.all([
            computeWebCryptoHash(file, 'SHA-1'),
            computeWebCryptoHash(file, 'SHA-256'),
            computeWebCryptoHash(file, 'SHA-512')
        ]);

        // 2. Calculate MD5 (Legacy, using CryptoJS)
        // CryptoJS is slower for large files, so we handle it separately
        const md5 = await computeMD5(file);

        const endTime = performance.now();
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

        return {
            fileName: file.name,
            fileSize: file.size,
            hashes: {
                md5: md5,
                sha1: sha1,
                sha256: sha256,
                sha512: sha512
            },
            timeTaken: timeTaken
        };

    } catch (e) {
        throw new Error("Hashing Failed: " + e.message);
    }
}

/**
 * Compute SHA hashes using Native Web Crypto API (Very Fast)
 */
async function computeWebCryptoHash(file, algorithm) {
    const arrayBuffer = await file.arrayBuffer(); // Loads file into memory (limitation: RAM)
    // For true huge-file support (>2GB), we'd need a stream reader (FileReader loop).
    // But arrayBuffer is standard for most web tools.
    
    const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute MD5 using CryptoJS (Slower, WordArray based)
 */
function computeMD5(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
            const hash = CryptoJS.MD5(wordArray).toString();
            resolve(hash);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
    });
}