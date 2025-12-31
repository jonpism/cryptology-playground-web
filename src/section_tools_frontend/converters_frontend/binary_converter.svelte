<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processBinary } from '../../section_tools_js/converters_js/binary_converter.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let mode = "encode";
  let selectedEncoding = "utf-8";
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Text to Binary" },
    { value: "decode", label: "Binary to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processBinary(inputText, mode, selectedEncoding);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      if (mode === 'encode') {
          mode = 'decode';
          if (result) inputText = result;
      } else {
          mode = 'encode';
          if (result) inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode || selectedEncoding)) {
      runConverter();
  }
</script>

<ToolCard title="Binary Converter">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <Select 
      label={mode === 'encode' ? "Text Encoding:" : "Target Encoding:"} 
      bind:value={selectedEncoding} 
      options={ENCODING_OPTIONS.map(o => o.value)} 
    />
  </div>

  <Input 
    label={mode === 'encode' ? "Input Text:" : "Input Binary:"}
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "Type text..." : "e.g. 01001000 01100101..."} 
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
      label={mode === 'encode' ? "Binary Output:" : "Text Output:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Binary" links={[{text: "Binary number - Wikipedia", url: "https://en.wikipedia.org/wiki/Binary_number"}]}>
  <p>
    <strong>Binary</strong> (Base-2) is the foundational language of computers. 
    It represents all data using only two symbols: <strong>0</strong> and <strong>1</strong>.
  </p>
  <p>
    When you type text, computers store it as a sequence of bytes. In the standard <strong>UTF-8</strong> encoding:
  </p>
  <ul>
    <li>The letter <strong>'A'</strong> is number 65, which is <code>01000001</code> in binary.</li>
    <li>The letter <strong>'a'</strong> is number 97, which is <code>01100001</code> in binary.</li>
  </ul>
  <p>
    This tool allows you to see exactly how your text looks to a computer, supporting standard formats (UTF-8) 
    as well as legacy encodings (Windows-1252, Shift-JIS, etc.).
  </p>
</Info>