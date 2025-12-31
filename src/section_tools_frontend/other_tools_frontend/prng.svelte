<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  
  import { generateSequence } from '../../section_tools_js/other_tools_js/prng.js';

  let seedInput = "12345";
  let countInput = "10";
  
  let resultIntegers = "";
  let resultFloats = "";
  let error = "";

  function handleGenerate() {
      error = "";
      resultIntegers = "";
      resultFloats = "";

      const seed = parseInt(seedInput);
      const count = parseInt(countInput);

      if (isNaN(seed)) return error = "Please enter a numeric seed.";
      if (isNaN(count) || count <= 0) return error = "Please enter a valid count (>0).";
      if (count > 10000) return error = "Max limit is 10,000 numbers to prevent freezing.";

      try {
          const { integers, floats } = generateSequence(seed, count);
          
          // format arrays for display (comma separated)
          resultIntegers = integers.join(', ');
          resultFloats = floats.map(f => f.toFixed(6)).join(', '); // formatting floats nicely
      } catch (e) {
          error = e.message;
      }
  }

  const prngLinks = [{text: "PRNG - Wikipedia", url: "https://en.wikipedia.org/wiki/Pseudorandom_number_generator"}];
</script>

<ToolCard title="Pseudo-Random Number Generator">
  
  <div class="controls-row">
    <div class="input-group">
        <label for="seed">Seed Value:</label>
        <input 
            id="seed" 
            type="number" 
            bind:value={seedInput} 
            placeholder="e.g. 12345" 
        />
        <small class="hint">The starting point of the sequence.</small>
    </div>

    <div class="input-group">
        <label for="count">Quantity:</label>
        <input 
            id="count" 
            type="number" 
            bind:value={countInput} 
            min="1" 
            max="1000" 
        />
    </div>
  </div>

  <div class="button-row">
    <Button on:click={handleGenerate}>Generate Sequence</Button>
    <Button variant="secondary" on:click={() => { 
        seedInput=""; resultIntegers=""; resultFloats=""; 
    }}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if resultIntegers}
    <div class="results-area">
        <Input 
            label="Generated Integers:" 
            value={resultIntegers} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            rows={4}
        />

        <Input 
            label="Generated Floats [0-1):" 
            value={resultFloats} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            rows={4}
        />
    </div>
  {/if}

</ToolCard>

<Info title="About PRNGs" links={prngLinks}>
  <p>A <b>Pseudo Random Number Generator (PRNG)</b> is an algorithm used to generate 
    a sequence of numbers that approximates the properties of random numbers. 
    Although the sequence appears random, it is actually determined by an initial value called the <b>seed</b>.</p>
    <h3>Key Features:</h3>
    <ul>
      <li>Deterministic: Given the same seed, a PRNG will always produce the same sequence of numbers.</li>
      <li>Efficient: Generates random numbers quickly and efficiently.</li>
      <li>Periodicity: The sequence eventually repeats after a fixed number of iterations, called the period.</li>
    </ul>
    <h3>Applications:</h3>
    <ul>
      <li>Simulations and Modeling</li>
      <li>Cryptography</li>
      <li>Game Development</li>
      <li>Statistical Sampling</li>
    </ul>
    <p>This tool application uses a <b>Linear Congruential Generator (LCG)</b>, which is a simple yet widely used PRNG algorithm. 
    You can input a seed and specify the number of pseudo-random integers and floats to generate. 
    The output demonstrates the deterministic nature of PRNGs while showcasing their versatility.</p>
</Info>

<style>
  .controls-row {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
      margin-right: 25px;
  }

  label {
      font-weight: bold;
      color: #334155;
      font-size: 0.9rem;
  }

  input {
      padding: 0.6rem;
      border: 2px solid #cbd5e1;
      border-radius: 6px;
      font-size: 1rem;
      width: 100%;
  }

  .hint {
      color: #64748b;
      font-size: 0.75rem;
  }

  .button-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
  }

  .results-area {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
  }

  @media (max-width: 600px) {
      .controls-row { flex-direction: column; gap: 1rem; }
  }
</style>