<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import Input from '../../components/Input.svelte';
  
  import { generatePrimes } from '../../section_tools_js/other_tools_js/prime_number_generator.js';

  let numPrimes = 5;
  let bitLength = 64; // default
  
  let results = [];
  let isGenerating = false;
  let error = "";

  async function handleGenerate() {
      if (numPrimes <= 0 || bitLength <= 1) {
          error = "Please enter valid parameters (Count > 0, Bits > 1).";
          return;
      }
      // safety limit for browser
      if (numPrimes > 1000) {
          error = "Max 1000 numbers at a time.";
          return;
      }

      error = "";
      results = [];
      isGenerating = true;

      try {
          // allow UI update before heavy calculation starts
          await new Promise(r => setTimeout(r, 50));
          results = await generatePrimes(numPrimes, bitLength);
      } catch (e) {
          error = e.message;
      } finally {
          isGenerating = false;
      }
  }

  function downloadList() {
      if (results.length === 0) return;
      const content = results.join('\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `primes_${bitLength}bit_${results.length}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }

  const primeNumLinks = [{text: "Prime Numbers - Wikipedia", url: "https://en.wikipedia.org/wiki/Prime_number"}];
</script>

<ToolCard title="Prime Number Generator">
  
  <div class="controls-row">
    <div class="input-group">
        <label for="count">Quantity:</label>
        <input id="count" type="number" bind:value={numPrimes} min="1" max="1000" />
    </div>

    <div class="input-group">
        <label for="bits">Bit Length:</label>
        <input id="bits" type="number" bind:value={bitLength} min="2" max="2048" />
    </div>
  </div>

  <div class="button-row" style="justify-content: center;">
    <Button on:click={handleGenerate} disabled={isGenerating}>
        {#if isGenerating}Generating...{:else}Generate Primes{/if}
    </Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if results.length > 0}
    <div class="results-area">
        <div class="results-header">
            <strong>Generated {results.length} Primes:</strong>
            <button class="link-btn" on:click={downloadList}>Download List (.txt)</button>
        </div>
        
        <div class="prime-list">
            {#each results as prime}
                <Input 
                value={prime} 
                readonly={true} 
                expandable={false}
                withCopy={true}
                />
            {/each}
        </div>
    </div>
  {/if}

</ToolCard>

<Info title="About Prime Numbers" links = {primeNumLinks}>
    <p>This tool allows users to generate a specified number of prime numbers, each with a defined bit length.
        <strong>Prime Numbers</strong> are integers greater than 1 that have no divisors other than 1 and themselves.
    It uses the Miller-Rabin primality test to ensure the generated numbers are truly prime, and provides an easy-to-use 
    interface for both beginners and experts. Applications include cryptography, random key generation, and mathematical exploration.
    Simply input the number of primes you wish to generate, specify their bit length, and let the tool do the work!</p>
  
  <p>
    Large prime numbers are the backbone of modern cryptography (like RSA). This tool uses the <strong>Miller-Rabin primality test</strong>, a probabilistic algorithm that is extremely accurate for determining if very large numbers are prime.
  </p>
  <ul>
    <li><strong>64-bit:</strong> Standard large integers.</li>
    <li><strong>256-bit+:</strong> Used in Elliptic Curve Cryptography.</li>
    <li><strong>1024-bit+:</strong> Used in RSA encryption.</li>
  </ul>
</Info>

<style>
  .controls-row {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
  }

  label {
      font-weight: bold;
      color: #334155;
      font-size: 0.9rem;
  }

  input[type="number"] {
      padding: 0.6rem;
      border: 2px solid #cbd5e1;
      border-radius: 6px;
      font-size: 1rem;
  }

  .link-btn {
      background: none;
      border: none;
      color: #3b82f6;
      text-decoration: underline;
      cursor: pointer;
      font-size: 0.85rem;
      margin-left: 10px;
  }

  .prime-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 300px;
      overflow-y: auto;
      padding-right: 5px;
  }

  .prime-item input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 4px;
      font-family: monospace;
      color: #334155;
      font-size: 0.9rem;
  }

  .prime-item input:focus {
      outline: none;
      border-color: #3b82f6;
      background: #fff;
  }
</style>