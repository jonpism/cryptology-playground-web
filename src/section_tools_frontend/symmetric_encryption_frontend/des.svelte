<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import SwapButton from '../../components/SwapButton.svelte';
  
  import { desEncrypt, desDecrypt, generateDESParams } from '../../section_tools_js/symmetric_encryption_js/des.js';

  let mode = "encrypt"; 
  
  // inputs
  let inputText = "";
  let keyInput = "";
  let ivInput = "";
  
  // settings
  let selectedMode = "CBC";    
  let selectedPadding = "Pkcs7"; 
  
  // output
  let resultOutput = "";
  let error = "";
  
  const modeOptions = [
    { value: "encrypt", label: "Encrypt (Plaintext -> Base64)" },
    { value: "decrypt", label: "Decrypt (Base64 -> Plaintext)" }
  ];

  const cipherModes = [
    { value: "CBC", label: "CBC (Cipher Block Chaining)" },
    { value: "ECB", label: "ECB (Electronic Codebook)" }
  ];

  const paddingOptions = [
    { value: "Pkcs7", label: "Pkcs7 (Default)" },
    { value: "ZeroPadding", label: "ZeroPadding" },
    { value: "NoPadding", label: "NoPadding" }
  ];

  // ECB mode does not use IV
  $: isIVRequired = selectedMode !== 'ECB';

  function handleGenerateParams() {
      const params = generateDESParams();
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
              resultOutput = desEncrypt(inputText, keyInput, ivInput, selectedMode, selectedPadding);
          } else {
              resultOutput = desDecrypt(inputText, keyInput, ivInput, selectedMode, selectedPadding);
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

  const desLinks = [{text: "DES - Wikipedia", url: "https://en.wikipedia.org/wiki/Data_Encryption_Standard"},
    {text: "DES - Splunk", url: "https://www.splunk.com/en_us/blog/learn/des-data-encryption-standard.html"},
    {text: "DES - Tutorialspoint", url: "https://www.tutorialspoint.com/cryptography/data_encryption_standard.htm"}
  ];
</script>

<ToolCard title="DES Encryption / Decryption">
  
  <div class="controls-grid">
    <Select label="Operation:" bind:value={mode} options={modeOptions} />
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
            label="Secret Key (8 Bytes / 16 Hex Chars):" 
            bind:value={keyInput} 
            placeholder="e.g. 0123456789ABCDEF" 
        />
        <button class="gen-btn" on:click={handleGenerateParams} title="Generate Random Key & IV">
            Generate Random
        </button>
    </div>

    {#if isIVRequired}
        <Input 
            label="Initialization Vector (IV):" 
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

<Info title="About DES" links={desLinks}>
  <p>
    <strong>DES (Data Encryption Standard)</strong> is a historic encryption algorithm from the 1970s.
  </p>
  
  <p>
    <strong>Warning:</strong> DES uses a short 56-bit key (represented as 64 bits/8 bytes), which is considered <strong>insecure</strong> today because it can be brute-forced easily. Use AES for secure applications.
  </p>
  <ul>
    <li><strong>Key Size:</strong> Strictly 8 bytes (64 bits).</li>
    <li><strong>Block Size:</strong> 8 bytes (64 bits).</li>
  </ul>

    <p><b>Modes:</b></p>
    <ul>
    <li><b>ECB (Electronic Codebook):</b> Simplest form, but less secure.</li>
    <li><b>CBC (Cipher Block Chaining):</b> Uses an initialization vector (IV) for better security.</li>
    </ul>
</Info>

<style>
  .controls-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
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