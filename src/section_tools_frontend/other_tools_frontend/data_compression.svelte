<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { HuffmanCompressor } from '../../section_tools_js/other_tools_js/data_compression.js';

  let inputText = "";
  let compressedOutput = "";
  let stats = null;
  let error = "";
  let autoUpdate = true;

  function handleCompress() {
      error = "";
      compressedOutput = "";
      stats = null;

      if (!inputText) {
          error = "Please enter text to compress.";
          return;
      }

      try {
          const compressor = new HuffmanCompressor();
          compressedOutput = compressor.compress(inputText);
          stats = compressor.getStats(inputText, compressedOutput);
      } catch (e) {
          error = "Compression Failed: " + e.message;
      }
  }

  $: if (autoUpdate && (inputText)) {
      handleCompress();}

  const Links = [{text: "Data compression - Wikipedia", url: "https://en.wikipedia.org/wiki/Data_compression"}];

</script>

<ToolCard title="Data Compression (Huffman)">
  
  <Input 
    label="Input Data:" 
    bind:value={inputText} 
    placeholder="Enter text to compress..." 
    expandable={true} 
    rows={4}
  />

  <div class="button-row">
    <Button on:click={handleCompress}>Compress Data</Button>
    <Button variant="secondary" on:click={() => { inputText=""; compressedOutput=""; stats=null; }}>Clear</Button>

    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if compressedOutput}
    <div class="results-area">
        <Input 
            label="Compressed Binary Stream:" 
            value={compressedOutput} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            rows={4}
            font="monospace"
        />

        {#if stats}
            <div class="stats-box">
                <div class="stat">
                    <span>Original Size:</span>
                    <strong>{stats.originalBits} bits</strong>
                </div>
                <div class="stat">
                    <span>Compressed Size:</span>
                    <strong>{stats.compressedBits} bits</strong>
                </div>
                <div class="stat highlight">
                    <span>Space Saved:</span>
                    <strong>{stats.ratio}%</strong>
                </div>
            </div>
        {/if}
    </div>
  {/if}

</ToolCard>

<Info title="About Huffman Coding" links={Links}>
  <p>
    <strong>Huffman Coding</strong> is a popular algorithm used for lossless data compression.
    This tool implements a Huffman-based data compression algorithm. Using the principles of 
    frequency-based encoding, it compresses data efficiently by assigning shorter codes to 
    more frequent characters. You can input any text data, and the tool will provide the compressed version.
  </p>

  <p>
    It works by analyzing the frequency of characters. Frequent characters (like 'e' or 'a') get very 
    short binary codes (e.g., '10'), while rare characters (like 'z' or 'x') get longer codes (e.g., '11001').
  </p>
  <p>
    This variable-length coding reduces the overall size of the data compared to fixed-length coding 
    (like standard ASCII where every character is 8 bits).
  </p>
</Info>

<style>
  .button-row {
    margin-bottom: 1.5rem;
    display: flex;
    gap: 0.5rem;
  }

  .results-area {
    margin-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
    padding-top: 1.5rem;
  }

  .stats-box {
      display: flex;
      justify-content: space-around;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      margin-top: 1rem;
  }

  .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.9rem;
      color: #475569;
  }

  .stat strong {
      font-size: 1.1rem;
      color: #0f172a;
      margin-top: 0.2rem;
  }

  .stat.highlight strong {
      color: #15803d;
  }
</style>