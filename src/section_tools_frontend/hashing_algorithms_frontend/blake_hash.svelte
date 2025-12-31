<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processBLAKE } from '../../section_tools_js/hashing_algorithms_js/blake_hash.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let selectedAlgo = "BLAKE3";
  let inputEncoding = "utf-8";
  let results = null;
  let error = "";
  let autoUpdate = true;

  const algoOptions = ["BLAKE3", "BLAKE2s", "BLAKE2b"];

  function runHash() {

    if (!inputText) {
        results = null;
        error = "";
        return;
    }
    
    error = "";
    results = null;

    try {
      results = processBLAKE(inputText, selectedAlgo, inputEncoding);
    } catch (e) {
      error = e.message;
    }
  }

  $: if (autoUpdate && (inputText || selectedAlgo || inputEncoding)) {
      runHash();}

  const links = [
    { text: "BLAKE3 Official Site", url: "https://github.com/BLAKE3-team/BLAKE3" },
    { text: "BLAKE2 Official Site", url: "https://www.blake2.net/" },
    { text: "@noble/hashes NPM", url: "https://www.npmjs.com/package/@noble/hashes" }
  ];
</script>

<ToolCard title="BLAKE Hash Family">
  
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
    expandable={true} 
    placeholder={inputEncoding === 'hex' ? "e.g. 4a 1b..." : "Type text here..."} 
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

<Info title="About BLAKE" links={links}>
  <p><b>Blake2</b> is a cryptographic hash function that is designed 
    to be faster and more secure than MD5, SHA-1, and the 
    SHA-2 and SHA-3 families. Developed by Jean-Philippe Aumasson, 
    Samuel Neves, Zooko Wilcox-O'Hearn, and Christian Winnerlein, 
    it was first presented in 2012 and is a follow-up to the original 
    BLAKE hash function, which was a finalist in the SHA-3 competition. 
    Blake2 is widely considered a robust and efficient hashing algorithm 
    suitable for a range of applications, from data integrity verification 
     to cryptographic security. </p>
    <p>Blake2 is optimized for speed, often running 2 to 3 times faster than SHA-256. 
    It is designed to be highly efficient on modern CPUs, using fewer 
    computational resources than many alternatives. Blake2 has emerged as a 
    strong candidate for most cryptographic and non-cryptographic applications 
    due to its speed, security, and flexibility. It is well-suited for modern 
    software development and remains a preferred choice where both performance 
    and security are crucial.</p>

    <p><b>Blake3</b> is a modern cryptographic hash function that builds 
    upon the principles of Blake2 but introduces several enhancements 
    to achieve even greater speed, versatility, and efficiency. It 
    was introduced by a team of cryptographers including Jack O'Connor, 
    Jean-Philippe Aumasson, Samuel Neves, and Zooko Wilcox-O'Hearn in 
    2020. </p>
    <p>Blake3 is designed to be exceptionally fast while maintaining 
    high security, making it suitable for a wide range of applications, 
    including cryptographic and non-cryptographic purposes. </p>
    <p>Blake3 is significantly faster than Blake2, SHA-256, and other widely 
    used hash algorithms, often achieving speeds up to 10 times faster than 
    SHA-256 on modern hardware. It is highly optimized for multi-core 
    processors, vectorized instruction sets, and parallelism, making it one
    of the fastest cryptographic hash functions available. </p>
    Blake3 is a groundbreaking advancement in the world of cryptographic 
    hashing, offering unmatched speed and versatility. It is well-suited for 
    both cryptographic and non-cryptographic tasks, and its parallel-friendly 
    design makes it ideal for modern computing environments.
</Info>