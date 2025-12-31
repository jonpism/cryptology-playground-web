<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SmallInputButton from '../../components/SmallInputButton.svelte';
  
  import { processShake } from '../../section_tools_js/hashing_algorithms_js/shake_hash.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let selectedAlgo = "SHAKE128";
  let inputEncoding = "utf-8";
  let outputBits = 256; // default 256 bits
  let results = null;
  let error = "";
  let autoUpdate = true;

  const algoOptions = ["SHAKE128", "SHAKE256"];

  function runHash() {
    if (!inputText) {
        results = null;
        error = "";
        return;
    }
    
    error = "";
    results = null;

    try {
      results = processShake(inputText, selectedAlgo, outputBits, inputEncoding);
    } catch (e) {
      error = e.message;
    }
  }

  $: if (autoUpdate && (inputText || selectedAlgo || inputEncoding || outputBits)) {
      runHash();
  }

  const links = [
    { text: "@noble/hashes NPM", url: "https://www.npmjs.com/package/@noble/hashes" },
    { text: "SHA-3 / SHAKE Standard (NIST)", url: "https://csrc.nist.gov/pubs/fips/202/final" },
    { text: "Wikipedia: SHA-3", url: "https://en.wikipedia.org/wiki/SHA-3#Instances" }
  ];
</script>

<ToolCard title="SHAKE hash">
  
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
      label="{selectedAlgo} Hex ({results.actualBits} bits):" 
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

<Info title="About SHAKE" links={links}>

    <p>SHAKE is a cryptographic hash function based on the Keccak family. 
    It is designed to be secure and efficient, providing variable-length output.
    SHAKE supports two main variants: SHAKE128 and SHAKE256, which differ in their security levels and output lengths.
    SHAKE is widely used in various applications, including digital signatures, message authentication codes, 
    and key derivation functions, due to its flexibility and security properties.</p>

  <p><strong>XOF (Extensible Output Function):</strong>
    Standard hashes (like SHA-256) have a fixed length. You can turn it on and squeeze out as many 
    bits as you need. You can generate a 128-bit hash, a 512-bit hash, or even a 10,000-bit stream from the same input.
  </p>

  <p><strong>SHAKE128 vs SHAKE256:</strong></p>
  <ul>
    <li>These numbers refer to the <strong>security strength</strong>, not the output length.</li>
    <li><strong>SHAKE128</strong> provides 128 bits of security against collisions (roughly equivalent to SHA-256).</li>
    <li><strong>SHAKE256</strong> provides 256 bits of security (roughly equivalent to SHA-512).</li>
  </ul>
  <p>
    SHAKE is widely used in newer cryptographic protocols, such as Post-Quantum Cryptography (Kyber, Dilithium), because of its versatility.
  </p>
</Info>
