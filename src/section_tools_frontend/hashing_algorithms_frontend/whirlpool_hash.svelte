<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processWhirlpool } from '../../section_tools_js/hashing_algorithms_js/whirlpool_hash.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let inputEncoding = "utf-8";
  let results = null;
  let error = "";
  let isLoading = false;
  let autoUpdate = true;

  async function runHash() {
    if (!inputText) {
        results = null;
        error = "";
        return;
    }
    
    error = "";
    isLoading = true;

    try {
      // await
      results = await processWhirlpool(inputText, inputEncoding);
    } catch (e) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  }

  $: if (autoUpdate && (inputText || inputEncoding)) {
      runHash();
  }

  const links = [
    { text: "NPM: hash-wasm", url: "https://www.npmjs.com/package/hash-wasm" },
    { text: "Wikipedia: Whirlpool", url: "https://en.wikipedia.org/wiki/Whirlpool_(hash_function)" }
  ];
</script>

<ToolCard title="Whirlpool hash function">
  
  <div class="controls-row">
    <Select 
      label="Input Encoding:" 
      bind:value={inputEncoding} 
      options={ENCODING_OPTIONS.map(o => o.value)} 
    />
  </div>

  <Input 
    label="Input Data:" 
    bind:value={inputText}
    expandable={true} 
    placeholder={inputEncoding === 'hex' ? "e.g. 4a 1b..." : "Type text here..."} 
  />

  <div class="button-row">
    <Button on:click={runHash} disabled={isLoading}>
      {isLoading ? "Hashing..." : "Generate Hash"}
    </Button>
    <Button variant="secondary" on:click={() => {inputText = ""; results = null;}}>Clear</Button>
    
    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if results}
    <Input 
      label="Hex digest:" 
      value={results.hex} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
    <Input 
      label="Base64 digest:" 
      value={results.base64} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Whirlpool" links={links}>
  <p>
    <strong>Whirlpool</strong> is a cryptographic hash function designed by Vincent Rijmen and Paulo Barreto. 
    It produces a fixed <strong>512-bit (64-byte)</strong> hash value, making it comparable to SHA-512 in terms of output size.
  </p>

  <p><strong>Key Characteristics:</strong></p>
  <ul>
    <li>
      It uses a modified version of the Advanced Encryption Standard (AES) block cipher logic. 
      Specifically, it uses a 512-bit block size rather than AES's 128-bit size.
    </li>
    <li>
      It is part of the ISO/IEC 10118-3 standard and is completely free of patents.
    </li>
    <li>
      <strong>Security:</strong> Whirlpool is considered highly secure. It has not been broken by any practical attack, 
      and its large 512-bit output makes it extremely resistant to collision attacks (birthday paradox).
    </li>
  </ul>
  <p>
    It is often used in combination with other hashes in software like VeraCrypt for key derivation.
  </p>
</Info>