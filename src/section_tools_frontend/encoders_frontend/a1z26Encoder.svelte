<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processA1Z26 } from '../../section_tools_js/encoders_js/a1z26Encoder.js';

  let inputText = "";
  let mode = "encode"; // 'encode' or 'decode'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Text to A1Z26 (Numbers)" },
    { value: "decode", label: "A1Z26 (Numbers) to Text" }
  ];

  function runCipher() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processA1Z26(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'encode') ? 'decode' : 'encode';
      if (result && !error) {
          inputText = result;
      }
      runCipher();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runCipher();
  }
</script>

<ToolCard title="A1Z26 Encoder/Decoder">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'encode' ? "Input Text:" : "Input Numbers:"}
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "e.g. Hello World" : "e.g. 8 5 12 12 15"} 
    expandable={true}
  />

  <div class="button-row">
    <Button on:click={runCipher}>Convert</Button>
    <Button variant="secondary" on:click={() => { inputText = ""; result = ""; }}>Clear</Button>
    <SwapButton on:click={swapModes} />
    
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
    />
  {/if}

</ToolCard>

<Info title="About A1Z26">
  <p>
    The <strong>A1Z26 Cipher</strong> is a simple substitution cipher that replaces each letter with its position in the alphabet.
  </p>
  
  <ul>
    <li><strong>A</strong> = 1</li>
    <li><strong>B</strong> = 2</li>
    <li>...</li>
    <li><strong>Z</strong> = 26</li>
  </ul>
  <p>
    It is often used as a basic puzzle step or combined with other ciphers (like Atbash) to create more complex codes.
    Decoding requires the numbers to be separated by spaces, commas, or dashes.
  </p>
</Info>