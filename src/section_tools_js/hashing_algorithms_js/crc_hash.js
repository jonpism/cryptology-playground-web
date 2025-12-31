import CRC32 from 'crc-32';
import { crc_64_ecma_182 } from 'js-crc/models';
import crc16 from 'crc/calculators/crc16';
import crc8 from 'crc/calculators/crc8';
import crc24 from 'crc/calculators/crc24';
import { inputEncoding } from '../helpers/inputEncoding';

const ALGOS = {
    'CRC-8/SMBUS':             { func: crc8,  width: 2 },
    'CRC-16/ARC':              { func: crc16, width: 4 },
    'CRC-24/OPENPGP':          { func: crc24, width: 6 },
    'CRC-32/ISO-HDLC':         { func: null,  width: 8 },
    'CRC-64/ECMA-182':         { func: crc_64_ecma_182, width: 16 }
};

/**
 * calculates CRC checksums.
 * @param {string} text - input text.
 * @param {string} variant - algorithm variant
 * @param {string} encoding - 'utf-8', 'hex', 'base64', etc.
 */
export function processCRC(text, variant, encoding = 'utf-8') {
    if (!text) throw new Error("Please enter some text.");

    let bytes;
    try {
        bytes = inputEncoding(text, encoding);
    } catch (e) {
        throw new Error(e.message);
    }

    // calculate checksum
    let hexResult = "";
    
    if (variant === 'CRC-32/ISO-HDLC') {
        // 'crc-32' lib returns signed int; convert to unsigned hex
        const signed = CRC32.buf(bytes);
        hexResult = (signed >>> 0).toString(16);
    } 
    else if (variant === 'CRC-64/ECMA-182') {
        // 'js-crc' handles Uint8Array
        hexResult = crc_64_ecma_182(bytes);
    } 
    else {
        // 'crc' lib calculators
        const algo = ALGOS[variant];
        if (!algo) throw new Error(`Algorithm "${variant}" is not supported.`);
        
        const number = algo.func(bytes);
        hexResult = number.toString(16);
    }

    // pad with leading zeros
    const width = ALGOS[variant]?.width || 8;
    const cleanHex = hexResult.padStart(width, '0');

    return {
        hex: cleanHex,
        integer: BigInt('0x' + cleanHex).toString() // BigInt handles 64-bit integers safely
    };
}