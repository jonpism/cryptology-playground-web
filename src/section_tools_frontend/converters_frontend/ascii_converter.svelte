<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processAscii } from '../../section_tools_js/converters_js/ascii_converter.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let mode = "encode"; // encode or decode
  let selectedEncoding = "utf-8";
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Text to ASCII (Decimal)" },
    { value: "decode", label: "ASCII (Decimal) to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processAscii(inputText, mode, selectedEncoding);
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

<ToolCard title="ASCII Converter">
  
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
    label={mode === 'encode' ? "Input Data:" : "Input ASCII Codes:"}
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "Type text..." : "e.g. 72 101 108 108 111"} 
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
      label={mode === 'encode' ? "ASCII (Decimal) Output:" : "Text Output:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About ASCII" links={[{ text: "ASCII - Wikipedia", url: "https://en.wikipedia.org/wiki/ASCII" },
  { text: "ASCII-CODE.com", url: "https://www.ascii-code.com/" }]}>

  <p>
    <strong>ASCII</strong> (American Standard Code for Information Interchange) is a character encoding standard that assigns a unique number to characters.
  </p>
  
  <p>For example:</p>
  <ul>
    <li><strong>A</strong> = 65</li>
    <li><strong>a</strong> = 97</li>
    <li><strong>Space</strong> = 32</li>
  </ul>
  <p>
    <strong>Why Extended ASCII?</strong> Standard ASCII uses only 7 bits (0-127). "Extended ASCII" uses the full 8 bits (0-255) 
    to support additional characters like <strong>ñ</strong>, <strong>ö</strong>, or <strong>€</strong>. 
    Using the encoding selector, you can see how these special characters map to different decimal values depending on the standard (e.g., Windows-1252 vs ISO-8859-1).
  </p>
</Info>