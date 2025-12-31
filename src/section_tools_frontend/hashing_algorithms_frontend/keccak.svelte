<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import Select from '../../components/Select.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processKeccak } from '../../section_tools_js/hashing_algorithms_js/keccak.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let selectedVariant = "Keccak-256";
  let selectedEncoding = "utf-8";
  let results = null;
  let error = "";
  let autoUpdate = true;

  const variants = ["Keccak-224", "Keccak-256", "Keccak-384", "Keccak-512"];

  function runHash() {

    if (!inputText) {
        results = null;
        error = "";
        return;
    }

    error = "";
    results = null;

    try {
      results = processKeccak(inputText, selectedVariant, selectedEncoding);
    } catch (e) {
      error = e.message;
    }
  }

  $: if (autoUpdate && (inputText || selectedEncoding)) {
      runHash();}

  const links = [
    { text: "@noble/hashes NPM", url: "https://www.npmjs.com/package/@noble/hashes" },
    { text: "Keccak Team", url: "https://keccak.team/keccak.html" }
  ];
</script>

<ToolCard title="Keccak">

  <div class="controls-row">
    <Select 
      label="Variant:" 
      bind:value={selectedVariant} 
      options={variants} 
    />
    <Select 
      label="Input Encoding:" 
      bind:value={selectedEncoding} 
      options={ENCODING_OPTIONS.map(o => o.value)} 
    />
  </div>
  
  <Input 
    label="Input Data:" 
    bind:value={inputText} 
    expandable={true}
    placeholder={selectedEncoding === 'hex' ? "e.g. 4a 1b..." : "Type text here..."}
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
      label="Hex Digest ({results.bitLength} bits):" 
      value={results.hex} 
      readonly={true} 
      expandable={false}
      withCopy={true} 
    />
    
    <Input 
      label="Base64 Digest:" 
      value={results.base64} 
      readonly={true} 
      expandable={false}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Keccak" links={links}>
    <p>Keccak is a family of cryptographic hash functions and the basis of the SHA-3 standard. It's widely known for its use in 
    <strong>Ethereum</strong> and other blockchain technologies.</p>
    <p><strong>Important Distinction:</strong> Although Keccak won the competition to become SHA-3, the final NIST standard (SHA3-256) 
        changed the padding slightly. Therefore, <strong>Keccak-256 ≠ SHA3-256</strong>. This tool generates the original Keccak hash 
        used by Ethereum (eth_hash).</p>
        <p>This tool allows you to generate Keccak hashes of input text using various digest lengths: 
        224, 256, 384, or 512 bits.</p>
        <b>Features:</b>
        <ul>
        <li>Choose your preferred hash bit length</li>
        <li>Support for legacy text encodings (Windows, ISO, Mac)</li>
        <li>View the resulting hash in Base64 and hexadecimal.</li>
        </ul>
        Use this tool for educational purposes or verifying data integrity.<br><br>
</Info>