<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processSHA2 } from '../../section_tools_js/hashing_algorithms_js/sha2_family.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let selectedAlgo = "SHA2-256";
  let inputEncoding = "utf-8";
  let results = null;
  let error = "";
  let autoUpdate = true;

  const algoOptions = ["SHA2-256", "SHA2-384", "SHA2-512"];

  function runHash() {

    if (!inputText) {
        results = null;
        error = "";
        return;
    }
    
    error = "";
    results = null;

    try {
      results = processSHA2(inputText, selectedAlgo, inputEncoding);
    } catch (e) {
      error = e.message;
    }
  }

  $: if (autoUpdate && (inputText || selectedAlgo || inputEncoding)) {
      runHash();}

  const links = [
    { text: "@noble/hashes NPM", url: "https://www.npmjs.com/package/@noble/hashes" },
    { text: "SHA-2 Family - Wikipedia", url: "https://en.wikipedia.org/wiki/SHA-2" }
  ];
</script>

<ToolCard title="SHA2 Family">
  
  <div class="controls-row">
    <Select 
      label="Algorithm:" 
      bind:value={selectedAlgo} 
      options={algoOptions} 
    />
    <Select 
      label="Input Encoding:" 
      bind:value={inputEncoding} 
      options={ENCODING_OPTIONS.map(o => o.value)} 
    />
  </div>

  <Input 
    label="Input Data:" 
    bind:value={inputText} 
    placeholder={inputEncoding === 'hex' ? "e.g. 4a 1b 3c..." : "Type text here..."} 
    expandable={true}
  />

  <div class="button-row">
    <Button on:click={runHash}>Generate Hash</Button>
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

<Info title="About SHA-2" links={links}>
  <p>
    <strong>SHA-2 (Secure Hash Algorithm 2)</strong> is a family of cryptographic hash functions designed by the 
    <strong>National Security Agency (NSA)</strong> and published by NIST in 2001. It was developed to replace 
    SHA-1, addressing its security vulnerabilities.
  </p>
  
  <p>This tool supports the three prominent members of the family:</p>
  <ul>
    <li>
      <strong>SHA-256:</strong> Generates a 256-bit (32-byte) hash. It is one of the most famous algorithms in the world, 
      serving as the backbone of the <strong>Bitcoin</strong> network and most SSL/TLS certificates (https).
    </li>
    <li>
      <strong>SHA-512:</strong> Generates a 512-bit (64-byte) hash. Unlike SHA-256, which uses 32-bit words, 
      SHA-512 operates on 64-bit words, making it generally faster on modern 64-bit processors.
    </li>
    <li>
      <strong>SHA-384:</strong> Effectively a truncated version of SHA-512. It computes the hash using the SHA-512 
      logic but drops part of the result to output 384 bits.
    </li>
  </ul>

  

  <p>
    <strong>Security Status:</strong> Unlike its predecessors (MD5 and SHA-1), SHA-2 is widely considered secure. 
    While theoretical attacks exist for reduced-round versions, no practical collision attacks have been found against the full algorithm. 
    It remains the industry standard for digital signatures and authentication.
  </p>
</Info>
