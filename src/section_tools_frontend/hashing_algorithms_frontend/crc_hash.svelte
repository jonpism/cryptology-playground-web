<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { processCRC } from '../../section_tools_js/hashing_algorithms_js/crc_hash.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let selectedAlgo = "CRC-32/ISO-HDLC"; // default to most common
  let inputEncoding = "utf-8";        // default to standard text
  let results = null;
  let error = "";
  let autoUpdate = true;

  const algoOptions = [
    "CRC-8/SMBUS", 
    "CRC-16/ARC", 
    "CRC-24/OPENPGP", 
    "CRC-32/ISO-HDLC", 
    "CRC-64/ECMA-182"
  ];

  function runHash() {

    if (!inputText) {
        results = null;
        error = "";
        return;
    }
    
    error = "";
    results = null;

    try {
      results = processCRC(inputText, selectedAlgo, inputEncoding);
    } catch (e) {
      error = e.message;
    }
  }

  $: if (autoUpdate && (inputText || selectedAlgo || inputEncoding)) {
      runHash();}

  const links = [
    { text: "NPM: crc", url: "https://www.npmjs.com/package/crc" },
    { text: "NPM: crc-32", url: "https://www.npmjs.com/package/crc-32" },
    { text: "NPM: js-crc", url: "https://www.npmjs.com/package/js-crc" }
  ];
</script>

<ToolCard title="CRC Calculator">
  
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
    <Button on:click={runHash}>Calculate Checksum</Button>
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
      expandable={false}
      withCopy={true} 
    />
    
    <Input 
      label="Decimal Value:" 
      value={results.integer} 
      readonly={true} 
      expandable={false}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About CRC" links={links}>
  <p>
    <strong>CRC (Cyclic Redundancy Check)</strong> is an error-detecting code commonly used in digital networks and storage devices to detect accidental changes to raw data.
  </p>
  <p class="warning">
    <strong>Not for Security:</strong> CRCs are <strong>not</strong> cryptographic hash functions. 
    They are designed to detect accidental errors (like bit flips), not malicious tampering. 
    It is very easy to generate a collision (two different files with the same CRC). 
    Do not use CRC for passwords or digital signatures.
  </p>
  <ul>
    <li><strong>CRC-32:</strong> Used in Ethernet, Gzip, and PNG files.</li>
    <li><strong>CRC-64:</strong> Used in ISO 3309 and certain database systems.</li>
    <li><strong>CRC-16:</strong> Commonly used in USB and Modbus.</li>
  </ul>
</Info>