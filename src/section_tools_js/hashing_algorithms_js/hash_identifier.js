const HASH_ALGORITHMS = {
    'CRC-8': 2,
    'CRC-16': 4, 'BSD checksum': 4, 'SYSV checksum': 4,
    'CRC-32': 8, 'Adler-32': 8,
    'CRC-64': 16,
    'MD2': 32, 'MD4': 32, 'MD5': 32,
    'SHA-1': 40, 'RIPEMD-160': 40,
    'SHA-224': 56, 'SHA-512/224': 56, 'SHA3-224': 56,
    'SHA-256': 64, 'SHA-512/256': 64, 'SHA3-256': 64, 'BLAKE2s': 64, 'GOST': 64, 'BLAKE3': 64,
    'SHA-384': 96, 'SHA3-384': 96,
    'SHA-512': 128, 'SHA3-512': 128, 'BLAKE2b': 128, 'Whirlpool': 128, 'MD6': 128,
    'Tiger': 48,      // 192 bits
    'RIPEMD-320': 80, // 320 bits
    'Poly1305-AES': 32 // 128 bits
};

/**
 * identifies possible hash algorithms based on string length.
 * @param {string} hashInput - hash string to analyze.
 * @returns {Array<string>} - list of matching algorithm names.
 */
export function identifyHash(hashInput) {

    // remove whitespace
    const cleanHash = hashInput.trim();
    const length = cleanHash.length;

    const matches = Object.entries(HASH_ALGORITHMS)
        .filter(([algo, algoLen]) => algoLen === length)
        .map(([algo]) => algo);

    return matches.sort(); // return sorted list
}