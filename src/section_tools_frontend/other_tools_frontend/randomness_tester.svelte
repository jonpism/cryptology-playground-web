<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { RandomnessTester, parseInputSequence } from '../../section_tools_js/other_tools_js/randomness_tester.js';

  let inputText = "";
  let result = null;
  let error = "";
  let autoUpdate = true;

  function handleTest() {
      error = "";
      result = null;

      try {
          const numbers = parseInputSequence(inputText);
          if (numbers.length < 10) {
              throw new Error("Please enter at least 10 numbers for a meaningful test.");
          }

          const tester = new RandomnessTester(10); // 10 bins
          result = tester.testSequence(numbers);
      } catch (e) {
          error = e.message;
      }
  }

  function loadExample() {
      // generate 50 reasonably random numbers
      const randoms = Array.from({length: 50}, () => Math.random().toFixed(4));
      inputText = randoms.join(" ");
      handleTest();
  }
  
  function loadBadExample() {
      // generate 50 biased numbers
      const biased = Array.from({length: 50}, () => (Math.random() * 0.3).toFixed(4));
      inputText = biased.join(" ");
      handleTest();
  }

  $: if (autoUpdate && (inputText)) {
      handleTest();
  }

  const chiSquareLinks = [{text: "Chi Squared Test: Wikipedia", url: "https://en.wikipedia.org/wiki/Chi-squared_test"}];
</script>

<ToolCard title="Randomness Tester (Chi-Square)">
  
  <Input 
    label="Input Sequence (0 to 1):" 
    bind:value={inputText} 
    placeholder="e.g. 0.12 0.54 0.91 0.33..." 
    expandable={true} 
    rows={5}
  />

  <div class="button-row">
    <Button on:click={handleTest}>Test Randomness</Button>
    <Button variant="secondary" on:click={loadExample}>Load Random Data</Button>
    <Button variant="secondary" on:click={loadBadExample}>Load Biased Data</Button>
    <Button variant="secondary" on:click={() => { inputText=""; result=null; }}>Clear</Button>
    <div style="margin-left: auto">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="results-area">
        <div class="status-banner" class:pass={result.passed} class:fail={!result.passed}>
            <strong>Test Result:</strong> 
            {result.passed ? "PASSED (Random)" : "FAILED (Not Random)"}
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <span class="label">Chi-Square Stat</span>
                <span class="value">{result.chi2Stat.toFixed(4)}</span>
            </div>
            <div class="stat-box">
                <span class="label">P-Value</span>
                <span class="value">{result.pValue.toFixed(4)}</span>
            </div>
            <div class="stat-box">
                <span class="label">Significance</span>
                <span class="value">0.05</span>
            </div>
        </div>

        <p class="explanation">
            {#if result.passed}
                The P-Value is &gt; 0.05, which means the distribution looks uniform. We fail to reject the null hypothesis of randomness.
            {:else}
                The P-Value is &le; 0.05, which suggests the numbers are <strong>not</strong> uniformly distributed.
            {/if}
        </p>
    </div>
  {/if}

</ToolCard>

<Info title="About Chi-Square Test" links={chiSquareLinks}>
  <p><b>The Randomness Tester</b> is a tool designed to evaluate the quality of random number sequences. 
    It employs statistical methods, such as the <b>Chi-Square test</b>, to determine whether a given sequence 
    of numbers exhibits properties of randomness. This is particularly useful for testing random number generators 
    used in simulations, cryptography, and other applications.</p>

    <b>How It Works:</b>
    <ol>
    <li>Input a sequence of random numbers in the range [0, 1), separated by spaces.</li>
    <li>The tool calculates a Chi-Square statistic based on the distribution of the input numbers.</li>
    <li>It compares the observed distribution to the expected uniform distribution and computes a p-value.</li>
    <li>A p-value greater than 0.05 (at the 5% significance level) indicates that the sequence likely passes the randomness test.</li>
    </ol>
    The tool offers a user-friendly interface for inputting data and viewing results in real time.
</Info>

<style>
  .button-row {
    margin-bottom: 1.5rem;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .results-area {
    margin-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
    padding-top: 1.5rem;
  }

  .status-banner {
      padding: 1rem;
      border-radius: 6px;
      text-align: center;
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
      border: 1px solid transparent;
  }

  .status-banner.pass {
      background: #f0fdf4;
      color: #15803d;
      border-color: #86efac;
  }

  .status-banner.fail {
      background: #fef2f2;
      color: #b91c1c;
      border-color: #fca5a5;
  }

  .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
  }

  .stat-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 0.8rem;
      border-radius: 6px;
      text-align: center;
      display: flex;
      flex-direction: column;
  }

  .stat-box .label {
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 0.3rem;
  }

  .stat-box .value {
      font-weight: bold;
      font-size: 1.1rem;
      color: #334155;
  }

  .explanation {
      font-size: 0.9rem;
      color: #475569;
      text-align: center;
      margin-top: 1rem;
  }
</style>