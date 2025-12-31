<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SmallInputButton from '../../components/SmallInputButton.svelte';
  
  import { processCShake } from '../../section_tools_js/hashing_algorithms_js/cshake_hash.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let selectedAlgo = "cSHAKE128";
  let inputEncoding = "utf-8";
  
  // XOF settings
  let outputBits = 256;

  // cSHAKE specific settings
  let customString = "";
  let funcNameString = "";

  let results = null;
  let error = "";
  let autoUpdate = true;

  const algoOptions = ["cSHAKE128", "cSHAKE256"];

  function runHash() {
    if (!inputText) {
        results = null;
        error = "";
        return;
    }
    
    error = "";

    try {
      results = processCShake(
          inputText, 
          selectedAlgo, 
          outputBits, 
          inputEncoding, 
          customString, 
          funcNameString
      );
    } catch (e) {
      error = e.message;
    }
  }

  $: if (autoUpdate && (inputText || selectedAlgo || inputEncoding || outputBits || customString || funcNameString)) {
      runHash();
  }

  const links = [
    { text: "@noble/hashes NPM", url: "https://www.npmjs.com/package/@noble/hashes" },
    { text: "NIST SP 800-185 (cSHAKE Spec)", url: "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-185.pdf" }
  ];
</script>

<ToolCard title="cSHAKE">
  
  <div class="controls-row">
    <Select label="Algorithm:" bind:value={selectedAlgo} options={algoOptions} />
    <Select label="Input Encoding:" bind:value={inputEncoding} options={ENCODING_OPTIONS.map(o => o.value)} />
  </div>

<div class="controls-row">
  <Input 
    label="Customization string (S):" 
    bind:value={customString}
    expandable={true}
    placeholder={inputEncoding === 'hex' ? "e.g. 4a 1b..." : "e.g. MyAppv1"} 
  />
    
    <Input 
    label="Function Name (N):" 
    bind:value={funcNameString}
    expandable={true}
    placeholder={inputEncoding === 'hex' ? "e.g. 4a 1b..." : "Optional"} 
  />
  </div>
  
  <SmallInputButton
    label="Output Bits:" 
    suffix="Bits" 
    min="8" 
    step="8" 
    bind:value={outputBits} 
    on:input={() => { if(autoUpdate) runHash(); }} 
  />

  <Input 
    label="Input Data:" 
    bind:value={inputText} 
    placeholder={inputEncoding === 'hex' ? "e.g. 4a 1b..." : "Type text here..."} 
    expandable={true}
  />

  <div class="button-row">
    <Button on:click={runHash}>Generate Hash</Button>
    <Button variant="secondary" on:click={() => {inputText = ""; customString=""; funcNameString=""; results = null;}}>Clear</Button>
    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if results}
    <Input 
      label="{selectedAlgo} Hex:" 
      value={results.hex} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
    <Input 
      label="{selectedAlgo} Base64:" 
      value={results.base64} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About cSHAKE" links={links}>
  <p>
    <strong>cSHAKE (Customizable SHAKE)</strong> is defined in NIST SP 800-185. It is identical to SHAKE, 
    but adds a mechanism to "personalize" the hash function using two extra strings:
  </p>
  <ul>
    <li>
      <strong>Customization String (S):</strong> A user-defined string. If you hash the text "hello" with S="Email", 
      you get a completely different result than hashing "hello" with S="Payment". This is useful for separating different parts of an application protocol.
    </li>
    <li>
      <strong>Function Name (N):</strong> Reserved for official NIST-defined functions (like KMAC). For general use, this is usually left empty.
    </li>
  </ul>
  <p class="warning">
    <strong>Note:</strong> If both S and N are empty, cSHAKE collapses exactly into standard SHAKE.
  </p>
</Info>
