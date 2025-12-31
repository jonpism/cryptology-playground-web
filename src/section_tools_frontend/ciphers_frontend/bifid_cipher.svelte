<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import SwapButton from '../../components/SwapButton.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { encryptBifid, decryptBifid, getGridString } from '../../section_tools_js/ciphers_js/bifid_cipher.js';

  let mode = "encrypt"; // 'encrypt' or 'decrypt'
  let inputText = "";
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encrypt", label: "Encrypt" },
    { value: "decrypt", label: "Decrypt" }
  ];

  // visualize the grid
  const gridStr = getGridString();
  const gridRows = [];
  for(let i=0; i<5; i++) {
      gridRows.push(gridStr.slice(i*5, (i+1)*5).split(''));
  }

  function handleProcess() {
      error = "";
      result = "";

      if (!inputText) return error = "Please enter text.";

      try {
          if (mode === 'encrypt') {
              result = encryptBifid(inputText);
          } else {
              result = decryptBifid(inputText);
          }
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

  $: if (autoUpdate && (inputText)) {
      handleProcess();}

    const bifidLinks=[{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bifid_cipher"},
    {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/bifid-cipher-in-cryptography"},
  ];
</script>

<ToolCard title="Bifid Cipher">
  
  <div class="layout">
    <div class="controls">
        <Select 
            label="Operation:" 
            bind:value={mode} 
            options={modeOptions} 
        />
        
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
    </div>

    <div class="grid-display">
        <div class="grid-title">Polybius Square</div>
        <div class="polybius-grid">
            {#each gridRows as row}
                <div class="grid-row">
                    {#each row as char}
                        <div class="grid-cell">{char}</div>
                    {/each}
                </div>
            {/each}
        </div>
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

<Info title="About Bifid Cipher" links={bifidLinks}>
  <p>The Bifid cipher is a classical encryption technique that combines 
    both substitution and transposition to encrypt messages. Developed 
    by the French cryptographer Félix Delastelle in the early 20th century 
    the Bifid cipher is known for its simplicity and effectiveness. </p>

    <p>The cipher uses a Polybius square, which is a 5x5 grid filled with letters. 
    The grid typically contains the letters A-Z (I and J are usually 
    combined to fit into the 25 squares).</p>
  
  <ol>
      <li><strong>Coordinates:</strong> Each letter is converted to its (Row, Column) numbers from the Polybius Square.</li>
      <li><strong>Transposition:</strong> All Rows are written in a line, followed by all Columns.</li>
      <li><strong>Regrouping:</strong> This long string of numbers is read in pairs of two.</li>
      <li><strong>Substitution:</strong> These new pairs are converted back into letters using the same square.</li>
  </ol>
</Info>

<style>
  .layout {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .controls {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
  }

  .grid-display {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      text-align: center;
  }

  .grid-title {
      font-size: 0.85rem;
      font-weight: bold;
      color: #64748b;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
  }

  .polybius-grid {
      display: inline-block;
      border: 2px solid #334155;
      background: white;
      margin-bottom: 20px;
  }

  .grid-row {
      display: flex;
  }

  .grid-cell {
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      border: 1px solid #cbd5e1;
      font-family: monospace;
      font-weight: bold;
      color: #0f172a;
  }

  .grid-note {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #94a3b8;
  }

  @media (max-width: 600px) {
      .layout { flex-direction: column-reverse; }
      .grid-display { width: 100%; box-sizing: border-box;}
  }
</style>