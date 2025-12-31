<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import Select from '../../components/Select.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processRIPEMD160 } from '../../section_tools_js/hashing_algorithms_js/ripemd160.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let selectedEncoding = "utf-8";
  let results = null;
  let error = "";
  let autoUpdate = true;

  function runHash() {

    if (!inputText) {
        results = null;
        error = "";
        return;
    }
    
    error = "";
    results = null;

    try {
      results = processRIPEMD160(inputText, selectedEncoding);
    } catch (e) {
      error = e.message;
    }
  }

  $: if (autoUpdate && (inputText || selectedEncoding)) {
      runHash();}

  const links = [
    { text: "@noble/hashes NPM", url: "https://www.npmjs.com/package/@noble/hashes" },
    { text: "RIPEMD - Wikipedia", url: "https://en.wikipedia.org/wiki/RIPEMD" }
  ];
</script>

<ToolCard title="RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest)">

  <Select 
      label="Input Encoding:" 
      bind:value={selectedEncoding} 
      options={ENCODING_OPTIONS.map(o => o.value)} 
    />
  
  <Input 
    label="Enter text:" 
    bind:value={inputText} 
    placeholder="Type here..."
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

<Info title="About RIPEMD-160" links={links}>
    <p>RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) is a cryptographic hash function 
    developed in 1996 by Hans Dobbertin, Antoon Bosselaers, and Bart Preneel. It was designed as a stronger 
    alternative to the original RIPEMD, which was based on the MD4 family of hash functions. RIPEMD-160 generates 
    a 160-bit hash value and is known for its strong resistance to collision and pre-image attacks.</p>
    <p><strong>Characteristics of RIPEMD-160:</strong></p>
    <ul>
    <li>Produces a 160-bit hash value, typically represented as a 40-character hexadecimal string.</li>
    <li>Based on a design principle similar to MD4 and MD5 but with more robustness.</li>
    <li>Performs two parallel lines of computation to ensure enhanced security.</li>
    <li>RIPEMD-160 is slower compared to MD5 and SHA-1 but provides better security.</li>
    </ul>
    <p>RIPEMD-160 is primarily used in cryptographic applications where higher security is needed. While it has not 
    been as widely adopted as SHA-256 or SHA-3, it remains a reliable option for applications that require a secure 
    hash function. RIPEMD-160 has been successfully used in cryptocurrency protocols, such as Bitcoin, to generate 
    public key hashes.</p>
    <p>Despite being secure, newer hash functions like SHA-256 are generally preferred today due to better overall 
    support and integration in modern security systems.</p>
</Info>
