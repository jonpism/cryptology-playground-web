<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processHex } from '../../section_tools_js/converters_js/hex_converter.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let mode = "encode"; // 'encode' or 'decode'
  let selectedEncoding = "utf-8";
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Text to Hex" },
    { value: "decode", label: "Hex to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processHex(inputText, mode, selectedEncoding);
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

<ToolCard title="Hex Converter">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <Select 
      label={mode === 'encode' ? "Input Encoding:" : "Target Encoding:"} 
      bind:value={selectedEncoding} 
      options={ENCODING_OPTIONS.map(o => o.value)} 
    />
  </div>

  <Input 
    label={mode === 'encode' ? "Input Text:" : "Input Hex String:"}
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "Type text..." : "e.g. 48656c6c6f"} 
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
      label={mode === 'encode' ? "Hex Output:" : "Text Output:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Hexadecimal" links={[{ text: "Hexadecimal - Wikipedia", url: "https://en.wikipedia.org/wiki/Hexadecimal" }]}>
  <p>
    <strong>Hexadecimal</strong> (Base-16) is the most common way to represent binary data in a human-readable format.
  </p>
  
  <p>
    It uses 16 symbols: <strong>0-9</strong> followed by <strong>A-F</strong>.
  </p>
  <ul>
    <li><strong>A</strong> = 10</li>
    <li><strong>F</strong> = 15</li>
    <li><strong>space</strong> = 20</li>
    <li><strong>10</strong> (Hex) = 16 (Decimal)</li>
  </ul>
  <p>
    Computers group data into Bytes (8 bits). Since one Hex digit represents exactly 4 bits (a "nibble"), two Hex digits represent exactly one Byte.
     This makes Hex perfect for debugging memory, colors (HTML `#FFFFFF`), or binary files.
  </p>
</Info>