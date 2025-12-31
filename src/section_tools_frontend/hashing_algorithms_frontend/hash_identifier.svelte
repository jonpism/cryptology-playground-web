<script>
  import Button from '../../components/Button.svelte';
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Info from '../../components/Info.svelte';

  import { identifyHash } from '../../section_tools_js/hashing_algorithms_js/hash_identifier.js';

  let inputHash = "";
  let results = [];
  let error = "";
  let hasSearched = false;

  function runIdentification() {
    error = "";
    results = [];
    hasSearched = true;

    if (!inputHash) {
      error = "Please enter a hash string.";
      return;
    }

    results = identifyHash(inputHash);

  }

  const aboutLinks = [
    { text: "Hash Function - Wikipedia", url: "https://en.wikipedia.org/wiki/Hash_function" }
  ];
</script>

<ToolCard title="Hash Identifier">
  
  <Input 
    label="Enter hash:" 
    bind:value={inputHash} 
    placeholder="Paste your hash string here..." 
  />

  <div class="button-row">
    <Button on:click={runIdentification}>Identify</Button>
    <Button variant="secondary" on:click={() => {inputHash = ""; hasSearched = false;}}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if hasSearched}
    <div class="result-area">
      <div class="info-badge">
        Detected Length: <strong>{inputHash.length} characters</strong>
      </div>

      {#if results.length > 0}
        <div class="success-box">
          <h4>Possible Algorithms:</h4>
          <div class="tags">
            {#each results as algo}
              <span class="tag">{algo}</span>
            {/each}
          </div>
        </div>
      {:else}
        <div class="msg warning">
          No matching algorithms found for this length.
        </div>
      {/if}
    </div>
  {/if}

</ToolCard>

<Info title="About Hash Identifier" links={aboutLinks}>
  <p>
    The Hash Identifier is designed to help you identify the possible hash algorithm used to generate 
    a given hash string based on its length. It is useful in cryptography, digital forensics, and other security-related fields.
  </p>
  <p><strong>Supported algorithms include:</strong></p>
  <ul>
    <li>MD2, MD4, MD5</li>
    <li>SHA-1, SHA-2 Family, SHA-3 Family</li>
    <li>Checksums (CRC-8 to CRC-64)</li>
    <li>RIPEMD, Whirlpool, Tiger, BLAKE, and more.</li>
  </ul>
  <p><em>Note: Some algorithms produce hashes of the same length, so multiple results may be returned.</em></p>
</Info>

<style>
  .button-row { display: flex; gap: 1rem; }
  .msg { padding: 1rem; border-radius: 6px; margin-top: 1rem; }
  .error { background: #fee2e2; color: #ef4444; }
  .warning { background: #ffedd5; color: #9a3412; }
  
  .result-area { margin-top: 1.5rem; }
  
  .info-badge {
    display: inline-block;
    background: #e2e8f0;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #475569;
    margin-bottom: 1rem;
  }

  .success-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    padding: 1.5rem;
    border-radius: 8px;
  }

  h4 { margin: 0 0 1rem 0; color: #166534; }

  .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  
  .tag {
    background: white;
    border: 1px solid #22c55e;
    color: #15803d;
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 2px 2px rgba(0,0,0,0.05);
  }
</style>