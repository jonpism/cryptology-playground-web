<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import SwapButton from '../../components/SwapButton.svelte';
  
  import { tripleDesEncrypt, 
    tripleDesDecrypt, 
    generate3DESParams } from '../../section_tools_js/symmetric_encryption_js/triple_des.js';

  let mode = "encrypt"; 
  
  // inputs
  let inputText = "";
  let keyInput = "";
  let ivInput = "";
  
  // settings
  let keySize = "24"; // 16 or 24
  let selectedMode = "ECB";    
  let selectedPadding = "Pkcs7"; 
  
  // output
  let resultOutput = "";
  let error = "";
  
  const modeOptions = [
    { value: "encrypt", label: "Encrypt (Plaintext -> Base64)" },
    { value: "decrypt", label: "Decrypt (Base64 -> Plaintext)" }
  ];

  const keySizeOptions = [
    { value: "24", label: "24 Bytes (192 bits) - Standard" },
    { value: "16", label: "16 Bytes (128 bits)" }
  ];

  const cipherModes = [
    { value: "ECB", label: "ECB (Electronic Codebook)" },
    { value: "CBC", label: "CBC (Cipher Block Chaining)" }
  ];

  const paddingOptions = [
    { value: "Pkcs7", label: "Pkcs7 (Default)" },
    { value: "ZeroPadding", label: "ZeroPadding" },
    { value: "NoPadding", label: "NoPadding" }
  ];

  // ECB mode does not use IV
  $: isIVRequired = selectedMode !== 'ECB';

  function handleGenerateParams() {
      const params = generate3DESParams(parseInt(keySize));
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
              resultOutput = tripleDesEncrypt(inputText, keyInput, ivInput, selectedMode, selectedPadding);
          } else {
              resultOutput = tripleDesDecrypt(inputText, keyInput, ivInput, selectedMode, selectedPadding);
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

  const tripleDesLinks = [{text: "Triple DES - Wikipedia", url: "https://en.wikipedia.org/wiki/Triple_DES"},
    {text: "Triple DES - Splunk", url: "https://www.splunk.com/en_us/blog/learn/triple-des-data-encryption-standard.html"},
    {text: "Triple DES - Geeks for Geeks", url: "https://www.geeksforgeeks.org/computer-networks/triple-des-3des/"}
  ];
</script>

<ToolCard title="Triple DES Encryption / Decryption">
  
  <div class="controls-grid">
    <Select label="Operation:" bind:value={mode} options={modeOptions} />
    <Select label="Key Length:" bind:value={keySize} options={keySizeOptions} />
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
            label={`Secret Key (${keySize} Bytes / ${parseInt(keySize)*2} Hex Chars):`} 
            bind:value={keyInput} 
            placeholder={`Enter ${keySize} bytes...`} 
        />
        <button class="gen-btn" on:click={handleGenerateParams} title="Generate Random Key & IV">
            Generate Random
        </button>
    </div>

    {#if isIVRequired}
        <Input 
            label="Initialization Vector (IV) - 8 Bytes:" 
            bind:value={ivInput} 
            placeholder="8 bytes (16 hex chars)" 
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

<Info title="About Triple DES (3DES)" links={tripleDesLinks}>
  <p>
    <strong>Triple DES</strong> applies the DES algorithm three times to each data block to improve security over standard DES.
  </p>
  
  <ul>
    <li><b>Note:</b> ECB mode is generally not recommended for sensitive data, as it does not hide data patterns.</li>
    <li><strong>Key 1, Key 2, Key 3:</strong> Uses 3 keys (effectively 168 bits) or 2 keys (112 bits).</li>
    <li><strong>Legacy:</strong> While stronger than DES, 3DES is slow and has been deprecated by NIST. Use AES for new applications.</li>
  </ul>

  <p style="color:gray; font-size:small;">Use for demonstration purposes only.</p>
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