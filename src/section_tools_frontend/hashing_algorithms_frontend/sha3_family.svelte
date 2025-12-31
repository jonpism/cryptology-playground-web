<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processSHA3 } from '../../section_tools_js/hashing_algorithms_js/sha3_family.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let selectedAlgo = "SHA3-256";
  let inputEncoding = "utf-8";
  let results = null;
  let error = "";
  let autoUpdate = true;

  const algoOptions = ["SHA3-224", "SHA3-256", "SHA3-384", "SHA3-512"];

  function runHash() {

    if (!inputText) {
        results = null;
        error = "";
        return;
    }
    
    error = "";
    results = null;

    try {
      results = processSHA3(inputText, selectedAlgo, inputEncoding);
    } catch (e) {
      error = e.message;
    }
  }

  $: if (autoUpdate && (inputText || selectedAlgo || inputEncoding)) {
      runHash();}

  const links = [
    { text: "@noble/hashes NPM", url: "https://www.npmjs.com/package/@noble/hashes" },
    { text: "SHA-3 Family - Wikipedia", url: "https://en.wikipedia.org/wiki/SHA-3" },
    { text: "NIST SHA-3 Standard", url: "https://csrc.nist.gov/pubs/fips/202/final" },
    { text: "Sponge Function - Wikipedia", url: "https://en.wikipedia.org/wiki/Sponge_function" }
  ];
</script>

<ToolCard title="SHA3 Family">
  
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
    placeholder={inputEncoding === 'hex' ? "e.g. 4a 1b..." : "Type text here..."} 
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

<Info title="About SHA-3" links={links}>
  <p>
    <strong>SHA-3 (Secure Hash Algorithm 3)</strong> is the latest member of the Secure Hash Algorithm family, 
    released by NIST in 2015. It is based on the <strong>Keccak</strong> algorithm, which won the public NIST hash competition 
    against dozens of other candidates.
  </p>

  <p>
    While SHA-2 is built using the Merkle-Damgård structure (similar to MD5 and SHA-1), SHA-3 uses a completely different 
    architecture called the <strong>Sponge Construction</strong>. This fundamental difference means that even if a mathematical 
    breakthrough were to break SHA-2, SHA-3 would likely remain secure.
  </p>

  <p><strong>Key Characteristics:</strong></p>
  <ul>
    <li>
      <strong>Drop-in Replacement:</strong> SHA-3 was designed to have the same output lengths as SHA-2 
      (224, 256, 384, and 512 bits) so systems can switch easily.
    </li>
    <li>
      <strong>Resistance:</strong> The sponge structure makes SHA-3 naturally resistant to "Length Extension Attacks," 
      a vulnerability that affects MD5, SHA-1, and SHA-2.
    </li>
    <li>
      <strong>Keccak vs. SHA-3:</strong> While SHA-3 is based on Keccak, NIST changed the "padding" (the final bytes added to the message) 
      in the final standard. This means <strong>SHA3-256 is not identical to Keccak-256</strong> (which is used by Ethereum).
    </li>
  </ul>
</Info>
