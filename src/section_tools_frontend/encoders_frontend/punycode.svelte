<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processPunycode } from '../../section_tools_js/encoders_js/punycode.js';

  let inputText = "";
  let mode = "encode"; // 'encode' or 'decode'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Unicode to Punycode" },
    { value: "decode", label: "Punycode to Unicode" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processPunycode(inputText, mode);
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

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }
</script>

<ToolCard title="Punycode Converter">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'encode' ? "Unicode Domain (e.g. münich):" : "Punycode (e.g. xn--mnich-kva):"}
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "Type non-ASCII text..." : "Type xn-- string..."} 
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
    />
  {/if}

</ToolCard>

<Info title="About Punycode" links={[{text: "Punycode - Wikipedia", url: "https://en.wikipedia.org/wiki/Punycode"}]}>
    
  <p>Punycode is a way to represent Unicode characters using ASCII characters only.<br>
    It is mainly used for Internationalized Domain Names (IDNs) to allow non-ASCII characters in web addresses.<br><br>
    <b>Example:</b><br>
    münich → mnich-kva<br>
    café → caf-dma<br><br>
    </p>

  <p>
    <strong>How it works:</strong>
  </p>
  <ul>
    <li>The domain <code>münich.com</code> contains the special character 'ü'.</li>
    <li>Punycode keeps the basic letters ('mnich') and moves the special info to the end.</li>
    <li>The result is prefixed with <code>xn--</code> to tell browsers it is encoded.</li>
    <li>Result: <code>xn--mnich-kva.com</code></li>
  </ul>
  <p>
    This allows international domains (IDNs) to work on the existing internet infrastructure.
  </p>
</Info>