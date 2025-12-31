import CryptoJS from 'crypto-js';

/**
 * calculates hashes for a file.
 * returns object with md5, sha1,sha256 hashes.
 */
async function calculateHashesForFile(file) {
    if (!file) throw new Error("File not provided.");

    // SHA-1, SHA-256
    const [sha1, sha256] = await Promise.all([
        computeWebCryptoHash(file, 'SHA-1'),
        computeWebCryptoHash(file, 'SHA-256')
    ]);

    // MD5
    const md5 = await computeMD5(file);

    return { md5, sha1, sha256 };
}

/**
 * compare two files by calculating their hashes.
 */
export async function compareFiles(file1, file2) {
    if (!file1 || !file2) {
        throw new Error("Please select two files to compare.");
    }

    const startTime = performance.now();

    // calculate hashes for both files in parallel
    const [hashes1, hashes2] = await Promise.all([
        calculateHashesForFile(file1),
        calculateHashesForFile(file2)
    ]);

    const endTime = performance.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    // determine if they are identical
    const isIdentical = 
        hashes1.md5 === hashes2.md5 &&
        hashes1.sha1 === hashes2.sha1 &&
        hashes1.sha256 === hashes2.sha256;

    return {
        file1: { name: file1.name, size: file1.size, hashes: hashes1 },
        file2: { name: file2.name, size: file2.size, hashes: hashes2 },
        isIdentical,
        timeTaken
    };
}

async function computeWebCryptoHash(file, algorithm) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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