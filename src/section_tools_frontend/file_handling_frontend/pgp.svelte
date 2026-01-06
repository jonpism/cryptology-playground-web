<script>
  import { encryptFile, decryptFile } from '../../section_tools_js/file_handling_js/pgp.js';
  import ToolCard from '../../components/ToolCard.svelte';
  import Info from '../../components/Info.svelte';
  import FileDropArea from '../../components/FileDropArea.svelte';
  import Button from '../../components/Button.svelte';

  let mode = 'encrypt'; // encrypt or decrypt
  let isLoading = false;
  let statusMsg = "";
  let statusType = ""; // success or error

  // encryption variables
  let encTargetFile = null;
  let encPublicKeyFile = null;
  let encPublicKeyText = "";

  // decryption variables
  let decTargetFile = null;
  let decPrivateKeyFile = null;
  let decPrivateKeyText = "";
  let decPassphrase = "";

  const readFileAsBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const downloadFile = (data, filename, isBinary = false) => {
    const blob = new Blob([data], { type: isBinary ? 'application/octet-stream' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // file handlers
  function handleEncFileChange(e) {
      if (e.detail && e.detail.length > 0) encTargetFile = e.detail[0];
  }

  async function handleEncKeyChange(e) {
      if (e.detail && e.detail.length > 0) {
          const file = e.detail[0];
          encPublicKeyFile = file;
          encPublicKeyText = await readFileAsText(file);
      }
  }

  function handleDecFileChange(e) {
      if (e.detail && e.detail.length > 0) decTargetFile = e.detail[0];
  }

  async function handleDecKeyChange(e) {
      if (e.detail && e.detail.length > 0) {
          const file = e.detail[0];
          decPrivateKeyFile = file;
          decPrivateKeyText = await readFileAsText(file);
      }
  }

  async function handleEncrypt() {
    statusMsg = "";
    if (!encTargetFile || !encPublicKeyText) {
        statusMsg = "Please upload both a file and a public key.";
        statusType = "error";
        return;
    }
    try {
        isLoading = true;
        const fileBytes = await readFileAsBuffer(encTargetFile);
        const encryptedData = await encryptFile(fileBytes, encPublicKeyText);
        downloadFile(encryptedData, `${encTargetFile.name}.enc`, false);
        statusMsg = `Success! ${encTargetFile.name}.enc downloaded.`;
        statusType = "success";
    } catch (err) {
        statusMsg = err.message;
        statusType = "error";
    } finally {
        isLoading = false;
    }
  }

  async function handleDecrypt() {
    statusMsg = "";
    if (!decTargetFile || !decPrivateKeyText) {
        statusMsg = "Please upload both an encrypted file and a private key.";
        statusType = "error";
        return;
    }
    try {
        isLoading = true;
        const encryptedBytes = await readFileAsBuffer(decTargetFile);
        const decryptedBytes = await decryptFile(encryptedBytes, decPrivateKeyText, decPassphrase);
        
        let outName = decTargetFile.name.replace(/\.(enc|pgp|gpg|asc)$/i, "");
        if (outName === decTargetFile.name) outName += ".dec";

        downloadFile(decryptedBytes, outName, true);
        statusMsg = `Success! ${outName} downloaded.`;
        statusType = "success";
    } catch (err) {
        statusMsg = err.message;
        statusType = "error";
    } finally {
        isLoading = false;
    }
  }

  const pgpLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Pretty_Good_Privacy"},
    {text: "OpenPGP", url: "https://www.openpgp.org/about/"},
    {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/computer-networks/pgp-authentication-and-confidentiality/"}
  ];
</script>

<ToolCard title="PGP Encryption Tool">
    
    <div class="tabs">
        <button class:active={mode === 'encrypt'} on:click={() => {mode = 'encrypt'; statusMsg = "";}}>
            Encrypt Mode
        </button>
        <button class:active={mode === 'decrypt'} on:click={() => {mode = 'decrypt'; statusMsg = "";}}>
            Decrypt Mode
        </button>
    </div>

    <div class="tool-body">
        {#if mode === 'encrypt'}
            <div class="form-group">
                <span style="font-weight: bold;">1. Select File to Encrypt</span>
                <FileDropArea 
                    label="Drop File Here" 
                    on:change={handleEncFileChange} 
                />
                {#if encTargetFile}
                    <div class="file-status">
                        📄 <strong>{encTargetFile.name}</strong>
                    </div>
                {/if}
            </div>

            <div class="form-group">
                <span style="font-weight: bold;">2. Recipient's Public Key (.asc)</span>
                <FileDropArea 
                    label="Drop Public Key (.asc)" 
                    accept=".asc,.txt,.key"
                    on:change={handleEncKeyChange} 
                />
                {#if encPublicKeyFile}
                    <div class="file-status key-status">
                        🔑 <strong>{encPublicKeyFile.name}</strong>
                    </div>
                {/if}
            </div>

            <Button on:click={handleEncrypt} disabled={isLoading}>
                {isLoading ? 'Encrypting...' : 'Encrypt & Download'}
            </Button>

        {:else}
            <div class="form-group">
                <span style="font-weight: bold;">1. Select Encrypted File (.enc, .pgp)</span>
                <FileDropArea 
                    label="Drop Encrypted File" 
                    on:change={handleDecFileChange} 
                />
                {#if decTargetFile}
                    <div class="file-status">
                        <strong>{decTargetFile.name}</strong>
                    </div>
                {/if}
            </div>

            <div class="form-group">
                <span style="font-weight: bold;">2. Your Private Key (.asc)</span>
                <FileDropArea 
                    label="Drop Private Key (.asc)" 
                    accept=".asc,.txt,.key"
                    on:change={handleDecKeyChange} 
                />
                {#if decPrivateKeyFile}
                    <div class="file-status key-status">
                        🔑 <strong>{decPrivateKeyFile.name}</strong>
                    </div>
                {/if}
            </div>

            <Button on:click={handleDecrypt} disabled={isLoading}>
                {isLoading ? 'Decrypting...' : 'Decrypt & Download'}
            </Button>
        {/if}

        {#if statusMsg}
            <div class="msg" class:error={statusType === 'error'} class:success={statusType === 'success'}>
                {statusMsg}
            </div>
        {/if}
    </div>

</ToolCard>

<Info title="About OpenPGP" links={pgpLinks}>
    <p>The <b>PGP Encryption Tool</b> is an encryption utility that allows users to securely encrypt files using the 
        recipient's <b>PGP public key</b>. It provides a simple graphical interface for selecting files and keys, 
        and performs fast encryption using the OpenPGP standard.
        </p>

        <h4>Key Features:</h4>
        <ul>
          <li><b>File Selection:</b> Choose any file on your system to encrypt.</li>
          <li><b>Public Key Loading:</b> Import a recipient's public key (.asc) for secure encryption.</li>
          <li><b>Encryption:</b> Encrypt your file using strong OpenPGP encryption.</li>
          <li><b>Download Location:</b> Encrypted files are automatically saved to your <b>Downloads</b> folder.</li>
        </ul>
     
        <p>
        The <b>PGP Decryption Tool</b> is a utility designed to <b>decrypt files</b> that were previously encrypted using a PGP public key. 
        It requires the matching <b>PGP private key</b> and passphrase (if protected) to decrypt the contents successfully.
        </p>

        <h4>Key Features:</h4>
        <ul>
          <li><b>Encrypted File Selection:</b> Easily choose any PGP-encrypted file (.enc) from your system.</li>
          <li><b>Private Key Loading:</b> Load your personal private key (.asc format) securely.</li>
          <li><b>Passphrase Support:</b> Decrypts keys protected by a passphrase via a secure input prompt.</li>
          <li><b>Decryption:</b> Extracts and saves the decrypted content into your <b>Downloads</b> folder.</li>
        </ul>

        <h3>Security Notice:</h3>
        <p>
        This tool assumes that you are the legitimate owner of the private key being used. For your safety, 
        make sure to <b>never share your private key or passphrase</b> with untrusted sources.
        </p>

        <h3>Note:</h3>
        <p>
        Supports PGP public keys in ASCII-armored format (.asc). Make sure to verify the recipient's key 
        authenticity before use.
        </p>

</Info>

<style>
    .tabs {
        display: flex;
        margin-bottom: 2rem;
        background: #cbd5e1;
        border-radius: 8px;
        padding: 4px;
        gap: 4px;
    }

    .tabs button {
        flex: 1;
        padding: 10px;
        background: transparent;
        color: #475569;
        border: none;
        cursor: pointer;
        font-weight: bold;
        border-radius: 6px;
        transition: all 0.2s;
        font-size: 0.95rem;
    }

    .tabs button.active {
        background: #fff;
        color: #0f172a;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .form-group { margin-bottom: 1.5rem; }

    .file-status {
        margin-top: 8px;
        padding: 8px 12px;
        background: #e2e8f0;
        border-radius: 6px;
        color: #334155;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .file-status.key-status {
        background: #fef3c7;
        color: #92400e;
    }
</style>