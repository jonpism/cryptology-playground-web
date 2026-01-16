import QRCode from 'qrcode';

/**
 * Generates a QR Code Data URL.
 * @param {string} text - content to encode.
 * @param {object} config - configuration options.
 * @returns {Promise<string>} - data string.
 */
export async function generateQRCode(text, config = {}) {
    const options = {
        errorCorrectionLevel: config.errorCorrectionLevel || 'M',
        type: 'image/png',
        quality: 0.92,
        margin: config.margin !== undefined ? config.margin : 4,
        scale: config.scale || 4, // px
        color: {
            dark: '#000000', // dots color
            light: '#ffffff' // background color
        }
    };

    try {
        if (!text) return null;
        const dataUrl = await QRCode.toDataURL(text, options);
        return dataUrl;
    } catch (err) {
        throw new Error(`QR Generation failed: ${err.message}`);
    }
}