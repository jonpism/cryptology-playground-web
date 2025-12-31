<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import DownloadZipButton from '../../components/DownloadZipButton.svelte';
  
  import { executeWienerAttack } from '../../section_tools_js/cryptanalysis_js/rsa_wiener_attack.js';

  let eInput = "";
  let nInput = "";
  
  let result = null;
  let error = "";

  // ZIP Data for results
  $: zipData = result && result.success ? [
      { name: "private_key_d.txt", content: result.d },
      { name: "prime_p.txt", content: result.p },
      { name: "prime_q.txt", content: result.q },
      { name: "analysis.txt", content: `e: ${eInput}\nn: ${nInput}\nphi: ${result.phi}` }
  ] : [];

  function handleAttack() {
    if (!eInput || !nInput) {
        error = "Please provide both e and N.";
        return;
    }
    
    error = "";
    result = null;

    try {
        result = executeWienerAttack(eInput, nInput);
    } catch (err) {
        error = "Error: " + err.message;
    }
  }

  function loadExample() {
      // Classic Wikipedia Example
      // p=379, q=239, N=90581, e=17993 -> d should be 5
      eInput = "17993";
      nInput = "90581";
      handleAttack();
  }

  const rsaWALinks = [
      { text: "Wikipedia: Wiener's Attack", url: "https://en.wikipedia.org/wiki/Wiener%27s_attack" },
      { text: "Continued Fractions", url: "https://en.wikipedia.org/wiki/Continued_fraction" },
      { text: "RSA Algorithm", url: "https://en.wikipedia.org/wiki/RSA_(cryptosystem)" }
  ];
</script>

<ToolCard title="RSA Wiener Attack">
  
  <div class="input-row">
    <Input 
        label="Public Exponent (e):" 
        bind:value={eInput} 
        placeholder="e.g. 17993" 
    />
    <Input 
        label="Modulus (N):" 
        bind:value={nInput} 
        placeholder="e.g. 90581" 
    />
  </div>

  <div class="button-row">
    <Button on:click={handleAttack}>Launch Attack</Button>
    <Button variant="secondary" on:click={loadExample}>Load Example</Button>
    <Button variant="secondary" on:click={() => { eInput=""; nInput=""; result=null; }}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="results-area">
        {#if result.success}
            <div class="success-banner">
                <strong>VULNERABILITY FOUND!</strong><br>
                Private Key recovered successfully.
            </div>

            <div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
                <DownloadZipButton 
                   data={zipData} 
                   zipName="wiener_attack_results.zip" 
                   label="Download Recovered Data" 
                />
            </div>

            <div class="grid-2">
                <Input label="Recovered Private Key (d):" value={result.d} readonly={true} withCopy={true} />
                <Input label="Euler's Totient φ(N):" value={result.phi} readonly={true} withCopy={true} />
            </div>

            <div class="grid-2">
                <Input label="Prime Factor (p):" value={result.p} readonly={true} withCopy={true} />
                <Input label="Prime Factor (q):" value={result.q} readonly={true} withCopy={true} />
            </div>

            <div class="math-details">
                <Input 
                    label="Continued Fraction Expansion [e/N]:" 
                    value={`[${result.continuedFractions.join(', ')}]`} 
                    readonly={true} 
                    expandable={true}
                    rows={2} 
                />
                
                <div class="convergents-box">
                    <label>Convergents Checked (k/d):</label>
                    <div class="tags">
                        {#each result.convergents as conv}
                           <span class="tag" class:highlight={conv.d === result.d}>
                             {conv.k}/{conv.d}
                           </span>
                        {/each}
                    </div>
                </div>
            </div>

        {:else}
            <div class="msg error">
                Attack Failed. The private key 'd' is likely not small enough for Wiener's Attack ($d > \frac{1}{3} N^{0.25}$).
            </div>
            
            <Input 
                label="Continued Fraction Expansion (Computed):" 
                value={`[${result.continuedFractions.join(', ')}]`} 
                readonly={true} 
            />
        {/if}
    </div>
  {/if}

</ToolCard>

<Info title="About Wiener's Attack" links={rsaWALinks}>
  <p>This application implements the RSA Wiener Attack, a cryptanalysis method that can break RSA encryption 
    when the private key is vulnerable due to a small private exponent (d). This is achieved by exploiting 
    properties of continued fractions and the public exponent (e) relative to the modulus (n).</p>
    
    <b>Features:</b><br>
    <ul>
    <li><b>Prime Factorization:</b> Attempts to factorize the modulus n into primes p and q using trial division.</li>
    <li><b>φ(N) Calculation:</b> Computes Euler's Totient function φ(N) based on the found p and q values.</li>
    <li><b>Continued Fractions:</b> Generates the continued fraction expansion of e/n to approximate the fraction.</li>
    <li><b>Convergents:</b> Computes the convergents of the continued fraction, providing candidates for the private key d.</li>
    <li><b>Secret Key (d) Discovery:</b> Identifies the private exponent d by solving a quadratic equation using the approximations.</li>
    </ul>
</Info>

<style>
  .input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .results-area {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
  }

  .success-banner {
      background: #f0fdf4;
      border: 1px solid #86efac;
      color: #166534;
      text-align: center;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
  }

  .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
  }

  .math-details {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
  }

  .convergents-box label {
      display: block;
      font-weight: bold;
      color: #334155;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
  }

  .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
  }

  .tag {
      background: #e2e8f0;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-family: monospace;
      color: #475569;
  }

  .tag.highlight {
      background: #22c55e;
      color: white;
      font-weight: bold;
      border: 1px solid #15803d;
  }

  @media (max-width: 600px) {
    .input-row, .grid-2 { grid-template-columns: 1fr; }
  }
</style>