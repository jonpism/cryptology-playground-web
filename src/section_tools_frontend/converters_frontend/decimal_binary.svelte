<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processDecimalBinary } from '../../section_tools_js/converters_js/decimal_binary.js';

  let inputText = "";
  let mode = "dec2bin"; // 'dec2bin' or 'bin2dec'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "dec2bin", label: "Decimal to Binary" },
    { value: "bin2dec", label: "Binary to Decimal" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processDecimalBinary(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'dec2bin') ? 'bin2dec' : 'dec2bin';
      
      if (result && !error) {
          inputText = result;
      }
      
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }
</script>

<ToolCard title="Decimal / Binary Converter">
  
  <div class="controls-row">
    <Select 
      label="Conversion Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'dec2bin' ? "Decimal Number (Base-10):" : "Binary Number (Base-2):"}
    bind:value={inputText} 
    placeholder={mode === 'dec2bin' ? "e.g. 42" : "e.g. 101010"} 
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
      label={mode === 'dec2bin' ? "Binary Result:" : "Decimal Result:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Number Bases">
  <p>
    This tool converts integers between the two most fundamental number systems in computing:
  </p>
  <ul>
    <li><strong>Decimal (Base-10):</strong> The standard system humans use (digits 0-9).</li>
    <li><strong>Binary (Base-2):</strong> The system computers use (digits 0 and 1).</li>
  </ul>
  
  

  <p>
    <strong>How it works:</strong>
    To convert Decimal to Binary, you repeatedly divide the number by 2 and keep the remainders. 
    To convert Binary to Decimal, you multiply each digit by powers of 2 (1, 2, 4, 8, 16...) and add them up.
  </p>

</Info>