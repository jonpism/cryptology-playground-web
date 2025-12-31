<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processBCD } from '../../section_tools_js/converters_js/decimal_bcd.js';

  let inputText = "";
  let mode = "dec2bcd"; // 'dec2bcd' or 'bcd2dec'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "dec2bcd", label: "Decimal to BCD" },
    { value: "bcd2dec", label: "BCD to Decimal" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processBCD(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'dec2bcd') ? 'bcd2dec' : 'dec2bcd';
      
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }
</script>

<ToolCard title="Decimal / BCD Converter">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'dec2bcd' ? "Decimal Input:" : "BCD Input:"}
    bind:value={inputText} 
    placeholder={mode === 'dec2bcd' ? "e.g. 95" : "e.g. 1001 0101"} 
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
      label={mode === 'dec2bcd' ? "BCD Output:" : "Decimal Output:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About BCD">
  <p>
    <strong>Binary-Coded Decimal (BCD)</strong> is a class of binary encodings of decimal numbers where each decimal digit is represented by a fixed number of bits, usually four.
  </p>

  <p>
    <strong>Difference from Pure Binary:</strong>
  </p>
  <ul>
    <li>In <strong>Pure Binary</strong>, the number <code>12</code> is stored as <code>1100</code>.</li>
    <li>In <strong>BCD</strong>, the number <code>12</code> is split into digits <code>1</code> and <code>2</code>.
      <ul>
        <li>1 = <code>0001</code></li>
        <li>2 = <code>0010</code></li>
        <li>Result = <code>0001 0010</code></li>
      </ul>
    </li>
  </ul>
  <p>
    BCD is less compact than pure binary but allows for easier display of digits on electronic systems (like digital clocks) and avoids rounding errors in financial software.
  </p>
</Info>