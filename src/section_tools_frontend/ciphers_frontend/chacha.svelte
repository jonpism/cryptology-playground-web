<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import SwapButton from '../../components/SwapButton.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processChaCha20, generateParams } from '../../section_tools_js/ciphers_js/chacha.js';

  let mode = "encrypt"; // 'encrypt' or 'decrypt'
  let inputText = "";
  let key = "";
  let nonce = "";
  let format = "Base64"; // output format for encrypt, input format for decrypt
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encrypt", label: "Encrypt (Text → Cipher)" },
    { value: "decrypt", label: "Decrypt (Cipher → Text)" }
  ];

  const formatOptions = [
      { value: "Base64", label: "Base64" },
      { value: "Hex", label: "Hexadecimal" }
  ];

  function handleProcess() {
      error = "";
      result = "";

      if (!inputText) {
          error = "Please enter text.";
          return;
      }

      // auto-fill random key/nonce
      if (mode === 'encrypt') {
          if (!key || !nonce) {
              const params = generateParams();
              if (!key) key = params.key;
              if (!nonce) nonce = params.nonce;
          }
      }

      if (!key || !nonce) {
          if (!autoUpdate) error = "Key and Nonce are required.";
          return;
      }

      try {
          result = processChaCha20(inputText, key, nonce, mode, format);
      } catch (e) {
          error = e.message;
      }
  }

  function toggleMode() {
      mode = (mode === 'encrypt') ? 'decrypt' : 'encrypt';
      // if valid result, move it to input
      if (result && !error) {
          inputText = result;
          result = "";
      }
  }

  $: if (autoUpdate && inputText) {
      // encrypt: auto-generate params if missing. 
      // decrypt: wait for the user to provide them.
      if (mode === 'encrypt' || (key && nonce)) {
          handleProcess();
      }
  }

  const chachaLinks = [
      {text: "Wikipedia", url: "https://en.wikipedia.org/wiki/ChaCha20-Poly1305"},
      {text: "RFC 8439", url: "https://datatracker.ietf.org/doc/html/rfc8439"}
  ];
</script>

<ToolCard title="ChaCha20 Cipher">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <Select 
      label="Format:" 
      bind:value={format} 
      options={formatOptions} 
    />
  </div>

  <div class="params-row">
      <div class="param-input">
          <label for="chacha-key">Key (32-byte Hex):</label>
          <input 
              id="chacha-key" 
              type="text" 
              bind:value={key} 
              placeholder={mode === 'encrypt' ? "Leave empty for random..." : "Required for decryption..."}
          />
      </div>
      <div class="param-input">
          <label for="chacha-nonce">Nonce (12-byte Hex):</label>
          <input 
              id="chacha-nonce" 
              type="text" 
              bind:value={nonce} 
              placeholder={mode === 'encrypt' ? "Leave empty for random..." : "Required for decryption..."}
          />
      </div>
  </div>

  <Input 
    label={mode === 'encrypt' ? "Plaintext:" : `Ciphertext (${format}):`} 
    bind:value={inputText} 
    placeholder={mode === 'encrypt' ? "Message to encrypt..." : "Ciphertext to decrypt..."} 
    expandable={true} 
    rows={3}
  />

  <div class="button-row">
    <Button on:click={handleProcess}>
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
    </Button>
    <Button variant="secondary" on:click={() => { inputText=""; result=""; key=""; nonce=""; }}>Clear</Button>
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

<Info title="About ChaCha20" links={chachaLinks}>
  <p><b>ChaCha20</b> is a high-speed, secure symmetric stream cipher designed by 
    cryptographer Daniel J. Bernstein. It is an improved variant of 
    the earlier Salsa20 cipher, and it has gained popularity due to its 
    performance, simplicity, and robustness against cryptographic attacks. </p>

    <p>ChaCha20 is often used in applications requiring high security and speed, 
    such as TLS for encrypted internet connections and mobile communications. 
    It operates on 512-bit blocks of data, processed in 20 rounds (by default) 
    to increase security. Each round consists of a series of quarter-round 
    transformations that mix data in a way that ensures diffusion and confusion, 
    making it resistant to cryptographic attacks. 
    Major tech companies like Google have adopted ChaCha20 for encrypting 
    HTTPS traffic in Google Chrome, especially for mobile clients. </p>

  <p>
    <i>Note: This tool uses the IETF variant of ChaCha20 (96-bit nonce, 32-bit counter). 
    It performs raw encryption without an authentication tag (Poly1305 is not included in this specific tool).</i>
  </p>
</Info>

<style>
  .controls-row {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .params-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      margin-bottom: 1rem;
      background: #f8fafc;
      padding: 0.8rem;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
  }

  .param-input {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      flex: 1;
  }

  .param-input label {
      font-weight: bold;
      color: #334155;
      font-size: 0.8rem;
  }

  .param-input input {
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-size: 0.9rem;
      font-family: monospace;
      width: 100%;
  }
  
  .param-input input:focus {
      outline: none;
      border-color: #3b82f6;
  }

  @media (max-width: 600px) {
      .controls-row { flex-direction: column; gap: 0.5rem; }
      .params-row { flex-direction: column; align-items: stretch; }
  }
</style>