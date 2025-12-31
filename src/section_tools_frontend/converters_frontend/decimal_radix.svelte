<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import SmallInput from '../../components/SmallInputButton.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processRadix } from '../../section_tools_js/converters_js/decimal_radix.js';

  let inputText = "";
  let mode = "dec2radix"; // 'dec2radix' or 'radix2dec'
  let targetBase = 36;    // default base
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "dec2radix", label: "Decimal to Base-N" },
    { value: "radix2dec", label: "Base-N to Decimal" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processRadix(inputText, targetBase, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'dec2radix') ? 'radix2dec' : 'dec2radix';
      if (result && !error) {
          inputText = result.replace(/,/g, ''); // remove formatting commas for input
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode || targetBase)) {
      runConverter();
  }
</script>

<ToolCard title="Decimal / Radix Converter">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <SmallInput 
      label="Base (Radix):" 
      min="2" 
      max="36"
      bind:value={targetBase} 
      on:input={() => { if(autoUpdate) runConverter(); }}
    />
  </div>

  <Input 
    label={mode === 'dec2radix' ? "Decimal Number:" : `Base-${targetBase} Number:`}
    bind:value={inputText} 
    placeholder={mode === 'dec2radix' ? "e.g. 255" : "e.g. FF"} 
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
      label={mode === 'dec2radix' ? `Base-${targetBase} Result:` : "Decimal Result:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Radix (Base)">
  <p>
    The <strong>Radix</strong> (or Base) represents the number of unique digits available in a number system.
  </p>
  
  <ul>
    <li><strong>Base 2 (Binary):</strong> 0, 1</li>
    <li><strong>Base 10 (Decimal):</strong> 0-9</li>
    <li><strong>Base 16 (Hex):</strong> 0-9, A-F</li>
    <li><strong>Base 36:</strong> 0-9, A-Z (The maximum standard alphanumeric base).</li>
  </ul>
  <p>
    This tool allows you to convert between the standard Decimal system and any custom base up to 36. 
    It is useful for encoding identifiers, shortening URLs, or understanding how different counting systems work.
  </p>
</Info>