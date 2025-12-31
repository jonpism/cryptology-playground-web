<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import SwapButton from '../../components/SwapButton.svelte';
  
  import { aesEncrypt, aesDecrypt, generateAESParams } from '../../section_tools_js/symmetric_encryption_js/aes.js';

  let mode = "encrypt"; // 'encrypt' or 'decrypt'
  
  let inputText = "";
  let keyInput = "";
  let ivInput = "";
  
  let selectedBitSize = "256"; // 128, 192, 256
  let selectedMode = "CBC";    // CBC, ECB, CTR, etc.
  let selectedPadding = "Pkcs7"; // Pkcs7, NoPadding
  
  let resultOutput = "";
  let error = "";
  
  const modeOptions = [
    { value: "encrypt", label: "Encrypt (Plaintext -> Base64)" },
    { value: "decrypt", label: "Decrypt (Base64 -> Plaintext)" }
  ];

  const bitSizeOptions = [
    { value: "128", label: "AES-128 (16 byte key)" },
    { value: "192", label: "AES-192 (24 byte key)" },
    { value: "256", label: "AES-256 (32 byte key)" }
  ];

  const cipherModes = [
    { value: "CBC", label: "CBC (Cipher Block Chaining)" },
    { value: "ECB", label: "ECB (Electronic Codebook)" },
    { value: "CTR", label: "CTR (Counter)" },
    { value: "OFB", label: "OFB (Output Feedback)" },
    { value: "CFB", label: "CFB (Cipher Feedback)" }
  ];

  const paddingOptions = [
    { value: "Pkcs7", label: "Pkcs7 (Default)" },
    { value: "ZeroPadding", label: "ZeroPadding" },
    { value: "Iso10126", label: "Iso10126" },
    { value: "NoPadding", label: "NoPadding" }
  ];

  // ECB mode does not use IV
  $: isIVRequired = selectedMode !== 'ECB';

  function handleGenerateParams() {
      const params = generateAESParams(parseInt(selectedBitSize));
      keyInput = params.key;
      ivInput = params.iv;
  }

  function handleProcess() {
      error = "";
      resultOutput = "";

      if (!inputText) return error = "Please enter text to process.";
      if (!keyInput) return error = "Please provide a secret key.";
      if (isIVRequired && !ivInput) return error = "IV is required for this mode.";

      try {
          if (mode === 'encrypt') {
              resultOutput = aesEncrypt(inputText, keyInput, ivInput, selectedMode, selectedPadding);
          } else {
              resultOutput = aesDecrypt(inputText, keyInput, ivInput, selectedMode, selectedPadding);
          }
      } catch (e) {
          error = e.message;
      }
  }

  function toggleMode() {
      mode = (mode === 'encrypt') ? 'decrypt' : 'encrypt';
      if (resultOutput && !error) {
          inputText = resultOutput;
          resultOutput = "";
      } else {
          inputText = "";
          resultOutput = "";
      }
  }

  const aesLinks = [{text: "AES - Wikipedia", url: "https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"},
    {text: "How does AES work? - Crypto StackExchange", url: "https://crypto.stackexchange.com/questions/3926/how-does-aes-work"},
    {text: "AES Key Lengths - Keylength.com", url: "https://www.keylength.com/en/4/"}
  ];
</script>

<ToolCard title="AES Encryption / Decryption">
  
  <div class="controls-grid">
    <Select label="Operation:" bind:value={mode} options={modeOptions} />
    <Select label="Key Size:" bind:value={selectedBitSize} options={bitSizeOptions} />
    <Select label="Block Mode:" bind:value={selectedMode} options={cipherModes} />
    <Select label="Padding:" bind:value={selectedPadding} options={paddingOptions} />
  </div>

  <Input 
    label={mode === 'encrypt' ? "Plaintext:" : "Ciphertext (Base64):"} 
    bind:value={inputText} 
    placeholder={mode === 'encrypt' ? "Secret message..." : "Encrypted string..."} 
    expandable={true} 
    rows={3}
  />

  <div class="split-view">
    <div class="key-group">
        <Input 
            label="Secret Key (Hex or String):" 
            bind:value={keyInput} 
            placeholder={`Enter ${parseInt(selectedBitSize)/8} bytes...`} 
        />
        <button class="gen-btn" on:click={handleGenerateParams} title="Generate Random Key & IV">
            Generate Random
        </button>
    </div>

    {#if isIVRequired}
        <Input 
            label="Initialization Vector (IV) - Hex:" 
            bind:value={ivInput} 
            placeholder="16 bytes (32 hex chars)" 
        />
    {/if}
  </div>

  <div class="button-row">
    <Button on:click={handleProcess}>
        {mode === 'encrypt' ? 'Encrypt Message' : 'Decrypt Message'}
    </Button>
    <Button variant="secondary" on:click={() => { 
        inputText=""; resultOutput=""; error=""; 
    }}>Clear</Button>
    <SwapButton on:click={toggleMode} />
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if resultOutput}
    <Input 
        label={mode === 'encrypt' ? "Encrypted Output (Base64):" : "Decrypted Plaintext:"} 
        value={resultOutput} 
        readonly={true} 
        expandable={true} 
        withCopy={true}
        rows={3}
    />
  {/if}

</ToolCard>

<Info title="About AES" links = {aesLinks}>
  
  <p><strong>Advanced Encryption Standard (AES)</strong> is a symmetric key block cipher, standardized by 
    the National Institute of Standards and Technology (NIST) in 2001. 
    It is used worldwide to secure data and communications and has become the most widely adopted encryption algorithm.</p>

    <p><strong>AES Key Features:</strong></p>
    <ul>
    <li><strong>Symmetric Encryption:</strong> AES uses the same key for both encryption and decryption, making it 
        faster and more efficient compared to asymmetric encryption methods like RSA.</li>
    <li><strong>Block Cipher:</strong> AES processes data in fixed-size blocks (128 bits). 
        If the input data is larger, it is divided into multiple blocks and processed sequentially.</li>
    <li><strong>Key Sizes:</strong> AES supports three different key sizes: 128, 192, and 256 bits. 
        AES-128 is commonly used, but AES-256 is preferred for higher security levels.</li>
    <li><strong>Security:</strong> AES is considered secure against all practical cryptographic attacks, 
        including brute force, and has been extensively analyzed by cryptographers. As of now, no effective attack has been found.</li>
    <li><strong>Modes: </strong>The tool supports the modes: <b>CBC, ECB (not secure), CTR, OFB, CFB</b></li>
    </ul>

  <ul>
    <li><strong>Block Modes:</strong>
        <ul>
            <li><strong>CBC (Recommended):</strong> Uses an IV to make each block unique. Secure.</li>
            <li><strong>ECB (Unsafe):</strong> Encrypts identical blocks identically. Do not use for secrets.</li>
            <li><strong>GCM/CTR:</strong> Stream-like modes, very fast.</li>
        </ul>
    </li>
    <li><strong>IV (Initialization Vector):</strong> Random data mixed with the first block to ensure randomness.</li>
  </ul>
</Info>

<style>
  .controls-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
    margin-bottom: 1rem;
  }

  .split-view {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .key-group {
      position: relative;
  }

  .gen-btn {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 0.75rem;
      background: none;
      border: none;
      color: #3b82f6;
      cursor: pointer;
      text-decoration: underline;
      padding: 0;
      margin-top: 0.2rem;
  }

  @media (max-width: 700px) {
    .controls-grid, .split-view { grid-template-columns: 1fr; }
  }
</style>