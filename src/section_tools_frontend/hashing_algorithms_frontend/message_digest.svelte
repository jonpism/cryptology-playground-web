<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processMD } from '../../section_tools_js/hashing_algorithms_js/message_digest.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions';

  let inputText = "";
  let selectedAlgo = "MD4";
  let inputEncoding = "utf-8";
  let results = null;
  let error = "";
  let isLoading = false;

  let autoUpdate = true;

  const algoOptions = ["MD4", "MD5"];

  async function runHash() {

    if (!inputText) {
        results = null;
        error = "";
        return;
    }

    error = "";
    results = null;
    isLoading = true;

    try {
      results = await processMD(inputText, selectedAlgo, inputEncoding);
    } catch (e) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  }

  $: if (autoUpdate && (inputText || selectedAlgo || inputEncoding)) {
      runHash();}

  const links = [
    { text: "NPM: hash-wasm", url: "https://www.npmjs.com/package/hash-wasm" },
    { text: "MD5 Collision Demo", url: "https://www.mscs.dal.ca/~selinger/md5collision/" },
    { text: "Wikipedia: MD5", url: "https://en.wikipedia.org/wiki/MD5" },
    { text: "Wikipedia: MD4", url: "https://en.wikipedia.org/wiki/MD4" }

  ];
</script>

<ToolCard title="Message Digest Family">
  
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

<Info title="About Message Digest" links={links}>
  <p class="warning">
    <strong>Security Warning:</strong> Both MD4 and MD5 are <strong>cryptographically broken</strong>. 
    MD4 can be broken in microseconds, and MD5 collisions can be generated in seconds on a standard smartphone.
    These should only be used for integrity checks (like file checksums) or educational purposes, never for security.
  </p>

  <p><b>MD4 (Message Digest Algorithm 4)</b> is a cryptographic hash function developed by
    Ronald Rivest in 1990. It is designed to produce a 128-bit hash value and was one of the earliest 
    widely adopted hash algorithms. MD4 laid the foundation for other hash functions such as MD5 and 
    SHA algorithms.</p>
    <p><strong>Characteristics of MD4:</strong></p>
    <ul>
    <li>Produces a 128-bit hash value.</li>
    <li>Utilizes three rounds of computation for generating the hash value.</li>
    <li>Considered highly efficient but no longer secure for modern cryptographic needs.</li>
    <li>MD4 is vulnerable to collision attacks, meaning different input data can produce the same hash.</li>
    </ul>
    <p>MD4 was commonly used in applications such as digital signatures and password hashing, 
    but due to its vulnerabilities, it is now considered obsolete for most security purposes. 
    Modern systems have moved to more secure algorithms like SHA-256 or SHA-3.</p>

    <p><b>MD5 (Message Digest Algorithm 5)</b> is a widely known cryptographic hash function developed 
    by Ronald Rivest in 1991 as an improvement over MD4. It generates a 128-bit hash value, typically 
    represented as a 32-character hexadecimal number. MD5 was once widely used for data integrity 
    checks and cryptographic applications.</p>
    <p><strong>Characteristics of MD5:</strong></p>
    <ul>
    <li>Produces a 128-bit hash value.</li>
    <li>Uses four rounds of computation to generate the hash.</li>
    <li>Efficient and relatively fast in generating hash values.</li>
    <li>MD5 is no longer considered secure due to its vulnerability to collision and pre-image attacks.</li>
    </ul>
    <p>Although MD5 is faster than more secure algorithms, it is not suitable for use in secure applications 
    like SSL certificates or digital signatures. Security researchers have demonstrated that attackers can generate
    different input data that results in the same MD5 hash value (collisions), significantly compromising its reliability.</p>
    <p>MD5 is still used for checksums to verify data integrity in non-security-critical applications, 
    but it is strongly recommended to use more secure hash functions, such as SHA-256, for any cryptographic use.</p>

</Info>
