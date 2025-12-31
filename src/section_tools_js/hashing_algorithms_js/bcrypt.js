import bcrypt from 'bcryptjs';

/**
 * hashes a password using bcrypt and formats the output.
 * @param {string} password - plain text password.
 * @returns {Promise<Object>} - object containing raw, base64, and hex formats.
 */
export async function processBcrypt(password) {
  if (!password) {
    throw new Error("Please enter a password.");
  }

  // async generate hash
  const hash = await bcrypt.hash(password, 10);

  return {
    raw: hash,
    base64: btoa(hash),       // Base64 encoding
    hex: stringToHex(hash)    // Hex encoding
  };
}

function stringToHex(str) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
}