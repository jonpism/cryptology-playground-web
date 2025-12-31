<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processOctal } from '../../section_tools_js/converters_js/octal_converter.js';

  let inputText = "";
  let mode = "dec2oct"; // 'dec2oct' or 'oct2dec'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "dec2oct", label: "Decimal to Octal" },
    { value: "oct2dec", label: "Octal to Decimal" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processOctal(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'dec2oct') ? 'oct2dec' : 'dec2oct';
      
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }
</script>

<ToolCard title="Octal Converter">
  
  <div class="controls-row">
    <Select 
      label="Conversion Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'dec2oct' ? "Decimal Number (Base-10):" : "Octal Number (Base-8):"}
    bind:value={inputText} 
    placeholder={mode === 'dec2oct' ? "e.g. 64" : "e.g. 100"} 
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
      label={mode === 'dec2oct' ? "Octal Result:" : "Decimal Result:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Octal" links={[{ text: "Octal - Wikipedia", url: "https://en.wikipedia.org/wiki/Octal" }]}>
  <p>
    The <b>Octal</b> system (Base-8) uses digits from <b>0 to 7</b>.
  </p>
  
  <p>
    Historically, octal was very popular in early computing (like the PDP-8 and Unix file permissions) because 
    it maps perfectly to 3 bits ($2^3 = 8$).
  </p>
  <ul>
    <li>Decimal 8 = Octal `10`</li>
    <li>Decimal 64 = Octal `100`</li>
  </ul>
  <p>
    While Hexadecimal (Base-16) is more common today, Octal is still widely used in Linux/Unix file permissions 
    (e.g., `chmod 755`).
  </p>
</Info>