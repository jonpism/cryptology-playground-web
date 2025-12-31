<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { factorizeInteger, formatFactorization } from '../../section_tools_js/other_tools_js/int_factorization';

  let numberInput = "";
  let resultFactors = null;
  let resultString = "";
  let error = "";
  let autoUpdate = true;
  let isProcessing = false;

  async function handleFactorize() {
      error = "";
      resultFactors = null;
      resultString = "";

      if (!numberInput) {
          error = "Please enter a number.";
          return;
      }

      isProcessing = true;

      try {
          // ui update before heavy calc
          await new Promise(r => setTimeout(r, 50));
          
          const factors = factorizeInteger(numberInput);
          resultFactors = factors;
          resultString = formatFactorization(factors);
      } catch (e) {
          error = e.message;
      } finally {
          isProcessing = false;
      }
  }

  $: if (autoUpdate && (numberInput)) {
      handleFactorize();}

      const intFactLinks = [
        {text: "Integer Factorization - Wikipedia", 
        url: "https://en.wikipedia.org/wiki/Integer_factorization"},]
</script>

<ToolCard title="Integer Factorization">
  
  <Input 
    label="Number to Factorize:" 
    bind:value={numberInput} 
    placeholder="e.g. 123456" 
    type="number" 
    min="1"
  />

  <div class="button-row">
    <Button on:click={handleFactorize} disabled={isProcessing}>
        {#if isProcessing}Calculating...{:else}Factorize{/if}
    </Button>
    <Button variant="secondary" on:click={() => { numberInput=""; resultFactors=null; }}>Clear</Button>

    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if resultFactors}
    <div class="results-area">
        
        <div class="result-box">
            <h4>Mathematical Representation:</h4>
            <div class="math-str">
                {numberInput} = {resultString}
            </div>
        </div>

        <div class="result-box">
            <h4>Factor Dictionary:</h4>
            <div class="dict-view">
                {JSON.stringify(resultFactors, null, 4)}
            </div>
        </div>

    </div>
  {/if}

</ToolCard>

<Info title="About Integer Factorization" links={intFactLinks}>

    <p><b>Integer factorization</b> is the process of decomposing a composite integer into a product 
    of smaller integers, known as factors, which, when multiplied together, give the original number.
    If all the factors are prime numbers, the factorization is called a prime factorization.
    For example, the integer 28 can be factored into 2 × 2 × 7, where 2 and 7 are prime numbers.</p>

    <p><strong>Key Concepts:</strong></p>
    <ul>
    <li><strong>Prime Factors:</strong> These are the factors of a number that are prime. For instance, the prime factors of 60 are 2, 3, and 5, 
    since 60 = 2 × 2 × 3 × 5.</li>
    <li><strong>Composite Numbers:</strong> These are numbers that have more than two distinct factors. For example, 15 is a composite number because 
    it can be factored into 3 and 5.</li>
    <li><strong>Unique Factorization Theorem:</strong> Also known as the Fundamental Theorem of Arithmetic, this states that every integer greater than 1 
    can be uniquely represented as a product of prime factors, up to the order of the factors. For example, 84 = 2 × 2 × 3 × 7, and no other combination of primes 
    yields 84.</li>
    <li><strong>Cryptography:</strong> Integer factorization is the backbone of many cryptographic systems, such as RSA encryption. The security of RSA relies on the 
    difficulty of factoring large composite numbers, which makes breaking the encryption computationally infeasible.</li>
    </ul>
  
  <p><strong>Example:</strong></p>
  <ul>
    <li>Input: <strong>60</strong></li>
    <li>Prime Factors: <strong>2, 2, 3, 5</strong></li>
    <li>Result: <b>60 = 2^2 * 3 * 5</b></li>
  </ul>

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
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .result-box h4 {
      margin: 0 0 0.5rem 0;
      color: #475569;
      font-size: 0.95rem;
  }

  .math-str {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0369a1;
      padding: 1rem;
      border-radius: 6px;
      font-family: monospace;
      font-size: 1.1rem;
      word-break: break-all;
  }

  .dict-view {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 1rem;
      border-radius: 6px;
      font-family: monospace;
      white-space: pre-wrap;
      color: #334155;
  }
</style>