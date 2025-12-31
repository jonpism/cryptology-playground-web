<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import SwapButton from '../../components/SwapButton.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processAffineCipher } from '../../section_tools_js/ciphers_js/affine_cipher.js';

  let mode = "encrypt"; // 'encrypt' or 'decrypt'
  let inputText = "";
  
  // keys
  let keyA = "5"; // default coprime
  let keyB = "8"; // default shift
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encrypt", label: "Encrypt" },
    { value: "decrypt", label: "Decrypt" }
  ];

  // common valid values for 'a' to help user
  const validAValues = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

  function handleProcess() {
      error = "";
      result = "";

      if (!inputText) return error = "Please enter text.";
      if (!keyA || !keyB) return error = "Please provide both keys (a and b).";

      try {
          result = processAffineCipher(inputText, keyA, keyB, mode);
      } catch (e) {
          error = e.message;
      }
  }

  function toggleMode() {
      mode = (mode === 'encrypt') ? 'decrypt' : 'encrypt';
      if (result && !error) {
          inputText = result;
          result = "";
      }
  }

  function setValidA(val) {
      keyA = val.toString();
  }

  $: if (autoUpdate && (inputText) && keyA && keyB) {
      handleProcess();}

  const affineLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Affine_cipher"},
    {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/implementation-affine-cipher"}
  ];
</script>

<ToolCard title="Affine Cipher">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <div class="key-inputs">
        <div class="k-group">
            <label for="key-a">Key A (Multiplier):</label>
            <input id="key-a" type="number" bind:value={keyA} placeholder="e.g. 5" />
            <small class="hint">Must be coprime to 26</small>
        </div>
        
        <div class="k-group">
            <label for="key-b">Key B (Shift):</label>
            <input id="key-b" type="number" bind:value={keyB} placeholder="e.g. 8" />
            <small class="hint">Any integer</small>
        </div>
    </div>
  </div>

  <div class="coprime-suggestions">
      <span>Valid 'a' suggestions: </span>
      {#each validAValues as val}
        <button class="chip" on:click={() => setValidA(val)} class:active={parseInt(keyA) === val}>
            {val}
        </button>
      {/each}
  </div>

  <Input 
    label={mode === 'encrypt' ? "Plaintext:" : "Ciphertext:"} 
    bind:value={inputText} 
    placeholder={mode === 'encrypt' ? "Message to encrypt..." : "Message to decrypt..."} 
    expandable={true} 
    rows={3}
  />

  <div class="button-row">
    <Button on:click={handleProcess}>
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
    </Button>
    <Button variant="secondary" on:click={() => { inputText=""; result=""; }}>Clear</Button>
    <SwapButton on:click={toggleMode} />

    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <Input 
        label="Result:" 
        value={result} 
        readonly={true} 
        expandable={true} 
        withCopy={true}
        rows={3}
    />
  {/if}

</ToolCard>

<Info title="About Affine Cipher" links={affineLinks}>
  <p>An <b>Affine Monoalphabetic Substitution Cipher</b> is a type of cipher that applies 
    a mathematical transformation to each letter in the plaintext to produce the ciphertext. 
    It is a specific form of monoalphabetic substitution cipher, meaning 
    it maps each letter of the plaintext to exactly one letter of the ciphertext alphabet.</p>

    <p>Each letter in the alphabet is assigned a unique number. For example, 
    in the standard 26-letter English alphabet: A = 0, B = 1, C = 2, ..., Z = 25. 
    The cipher uses a function of the form: C = (a * P + b) mod 26, where:</p>
    <ul>
    <li><b>C</b> is the ciphertext letter<br></li>
    <li><b>P</b> is the plaintext letter <br></li>
    <li><b>a</b> and <b>b</b> are keys for the cipher, with a typically chosen to be coprime with 26 
    (for the English alphabet) to ensure a unique mapping for each letter</li>
    </ul>

  <p>
    <strong>The Math:</strong>
  </p>
  <ul>
    <li><strong>Encryption:</strong> C = (a * P + b) mod {26}</li>
    <li><strong>Decryption:</strong> P = a^{-1} * (C - b) mod {26}</li>
  </ul>
  <p>
    The multiplier <em>a</em> must be <strong>coprime</strong> to 26 (they share no common factors other than 1). 
    This ensures that each letter maps to a unique result, allowing decryption. If <em>a</em> is an even number or 13, information is lost.
  </p>
</Info>

<style>
  .controls-row {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .key-inputs {
      display: flex;
      gap: 1rem;
      flex: 1;
      margin-top: -20px;
  }

  .k-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
  }

  .k-group label {
      font-weight: bold;
      color: #334155;
      font-size: 0.9rem;
  }

  .k-group input {
      padding: 0.6rem;
      border: 2px solid #cbd5e1;
      border-radius: 6px;
      width: 100%;
      font-size: 1rem;
  }

  .k-group .hint {
      color: #64748b;
      font-size: 0.75rem;
  }

  .coprime-suggestions {
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #64748b;
  }

  .chip {
      background: #e2e8f0;
      border: none;
      border-radius: 12px;
      padding: 2px 8px;
      margin: 0 2px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
  }

  .chip:hover { background: #cbd5e1; }
  .chip.active { background: #3b82f6; color: white; }

  @media (max-width: 600px) {
      .controls-row { flex-direction: column; }
      .key-inputs { width: 100%; }
      .k-group { flex: 1; }
  }
</style>