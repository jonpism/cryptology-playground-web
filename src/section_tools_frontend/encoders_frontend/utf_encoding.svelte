<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processUtf } from '../../section_tools_js/encoders_js/utf_encoding.js';

  let inputText = "";
  let mode = "encode"; // 'encode' or 'decode'
  let selectedEncoding = "utf-8";
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Text to Bytes (Hex)" },
    { value: "decode", label: "Bytes (Hex) to Text" }
  ];

  const encodingOptions = [
    { value: "utf-8", label: "UTF-8" },
    { value: "utf-16le", label: "UTF-16 LE (Little Endian)" },
    { value: "utf-16be", label: "UTF-16 BE (Big Endian)" },
    { value: "utf-32le", label: "UTF-32 LE" },
    { value: "utf-32be", label: "UTF-32 BE" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processUtf(inputText, selectedEncoding, mode);
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
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode || selectedEncoding)) {
      runConverter();
  }
</script>

<ToolCard title="UTF Encoder / Decoder">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <Select 
      label="Encoding Standard:" 
      bind:value={selectedEncoding} 
      options={encodingOptions} 
    />
  </div>

  <Input 
    label={mode === 'encode' ? "Input Text:" : "Input Bytes (Hex):"}
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "Type text..." : "\\x48\\x69 or 48 69"} 
    expandable={true}
  />

  <div class="button-row">
    <Button on:click={runConverter}>Convert</Button>
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
      monospace={true}
    />
  {/if}

</ToolCard>

<Info title="About UTF Encodings">
  <p><b>Unicode Transformation Formats (UTFs)</b> are a set of methods 
    used to encode Unicode characters so they can be efficiently 
    represented in computer systems. Unicode itself is a 
    standardized encoding system that assigns a unique code point 
    (an integer) to every character across different languages, scripts, 
    and symbols worldwide. However, storing or transmitting these 
    code points directly as integers isn't always practical, 
    so Unicode Transformation Formats come into play to encode 
    these code points into sequences of bytes. </p>

  <ul>
    <li><strong>UTF-8:</strong> UTF-8 is the most widely used Unicode encoding 
    and is variable-length. It uses 1 to 4 bytes to represent a character.</li>
    <li><strong>UTF-16:</strong> UTF-16 is also a variable-length encoding, using either 2 or 4 bytes. Used by Windows and Java.</li>
    <li><strong>UTF-32:</strong> UTF-32 is a fixed-length encoding that uses 4 bytes for every 
    character, regardless of the code point. Simple but uses more memory.</li>
  </ul>

    <strong>Endianness (LE/BE):</strong> Refers to the order of bytes:
    <ul>
        <li><em>Little Endian (LE)</em> stores the least significant byte first (common on Intel/Apple silicon). </li>
        <li><em>Big Endian (BE)</em> stores the most significant byte first (network standard).</li>
    </ul>
</Info>