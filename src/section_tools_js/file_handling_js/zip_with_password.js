import * as zip from "@zip.js/zip.js";

/**
 * creates a password-protected ZIP file from provided file objects.
 * uses AES-256 encryption.
 * * @param {FileList|File[]} files - files to zip.
 * @param {string} password - password for encryption.
 * @returns {Promise<Blob>} - generated ZIP blob.
 */
export async function createEncryptedZip(files, password) {
    if (!files || files.length === 0) {
        throw new Error("No files selected.");
    }
    if (!password) {
        throw new Error("Password is required.");
    }

    // configure zip.js
    zip.configure({
        useWebWorkers: true
    });

    const blobWriter = new zip.BlobWriter("application/zip");
    const zipWriter = new zip.ZipWriter(blobWriter, {
        password: password,
        encryptionStrength: 3 // AES-256
    });

    try {
        for (const file of files) {
            // add file to zip
            // file.webkitRelativePath if available (folder upload), else file.name
            const filename = file.webkitRelativePath || file.name;
            
            await zipWriter.add(filename, new zip.BlobReader(file));
        }

        // close and generate blob
        await zipWriter.close();
        return await blobWriter.getData();

    } catch (e) {
        throw new Error("Zip Creation Failed: " + e.message);
    }
}