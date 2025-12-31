<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import SwapButton from '../../components/SwapButton.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processCaesarCipher } from '../../section_tools_js/ciphers_js/caesar_cipher.js';

  let mode = "encrypt"; // 'encrypt' or 'decrypt'
  let inputText = "";
  let shiftValue = 3;   //default shift
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encrypt", label: "Encrypt (Shift Forward)" },
    { value: "decrypt", label: "Decrypt (Shift Backward)" }
  ];

  function handleProcess() {
      error = "";
      result = "";

      if (!inputText) {
          error = "Please enter text.";
          return;
      }

      // reverse the shift for decryption (negative)
      const effectiveShift = mode === 'encrypt' ? shiftValue : -shiftValue;

      try {
          result = processCaesarCipher(inputText, effectiveShift);
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

  $: if (autoUpdate && (inputText) && shiftValue) {
      handleProcess();}

    const caesarLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Caesar_cipher"},
        {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/caesar-cipher-in-cryptography"}
    ];
</script>

<ToolCard title="Caesar Cipher">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <div class="shift-control">
        <label for="shift-input">Shift Amount (ROT):</label>
        <input 
            id="shift-input" 
            type="number" 
            bind:value={shiftValue} 
            min="1" 
            max="25"
        />
    </div>
  </div>

  <Input 
    label={mode === 'encrypt' ? "Plaintext:" : "Ciphertext:"} 
    bind:value={inputText} 
    placeholder={mode === 'encrypt' ? "Message to hide..." : "Message to reveal..."} 
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

<Info title="About Caesar Cipher" links = {caesarLinks}>
  <p>The <b>Caesar Cipher</b> is one of the simplest and oldest known encryption techniques, 
    attributed to Julius Caesar. It's a type of substitution cipher where each
    letter in the plaintext is shifted a fixed number of positions down or up the alphabet.</p>
    <p>The cipher relies on a 'shift' value, which is the number of positions each letter 
    will be moved. For example, with a shift of 3: 'A' becomes 'D', 'B' becomes 'E',  
    'Z' becomes 'C' (wrapping back to the beginning of the alphabet). </p> 
    <p>Caesar Cipher is easy to break, especially with brute force, because there 
    are only 26 possible shifts for the English alphabet. Due to its simplicity 
    and low security, it's primarily used for educational purposes rather than 
    for secure communication.</p>
</Info>

<style>
  .controls-row {
    display: flex;
    gap: 1.5rem;
    align-items: flex-end;
    margin-bottom: 1rem;
  }

  .shift-control {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 25px;
  }

  .shift-control label {
      font-weight: bold;
      color: #334155;
      font-size: 0.9rem;
  }

  .shift-control input {
      padding: 0.6rem;
      border: 2px solid #cbd5e1;
      border-radius: 6px;
      width: 70px;
      font-size: 1rem;
  }

  .shift-control input:focus {
      outline: none;
      border-color: #3b82f6;
  }

  @media (max-width: 500px) {
      .controls-row { flex-direction: column; align-items: stretch; }
      .shift-control input { width: 100%; }
  }
</style>