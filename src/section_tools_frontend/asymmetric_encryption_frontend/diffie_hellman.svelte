<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  
  import { calculateDiffieHellman } from '../../section_tools_js/asymmetric_encryption_js/diffie_hellman.js';

  let base = "";      // g
  let modulus = "";   // p
  let expA = "";      // a (Alice)
  let expB = "";      // b (Bob)

  let result = null;
  let error = "";

  function handleCalculate() {
    error = "";
    result = null;

    try {
      result = calculateDiffieHellman(base, modulus, expA, expB);
    } catch (e) {
      error = e.message;
    }
  }

  // example
  function loadExample() {
      base = "5";
      modulus = "23";
      expA = "6";
      expB = "15";
      handleCalculate();
  }

    const diffieHellmanLinks = [
      { text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange" },
      { text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/implementation-diffie-hellman-algorithm" }
    ];
</script>

<ToolCard title="Diffie-Hellman Key Exchange">
  
  <div class="grid-layout">
    <div class="section-box">
      <h4>Public Parameters (Known to everyone)</h4>
      <div class="row">
        <Input label="Generator / Base (g):" bind:value={base} placeholder="e.g. 5" />
        <Input label="Prime Modulus (p):" bind:value={modulus} placeholder="e.g. 23" />
      </div>
    </div>

    <div class="split-row">
      <div class="section-box alice">
        <h4>Alice</h4>
        <Input label="Private Key (a):" bind:value={expA} placeholder="e.g. 6" />
      </div>
      
      <div class="section-box bob">
        <h4>Bob</h4>
        <Input label="Private Key (b):" bind:value={expB} placeholder="e.g. 15" />
      </div>
    </div>
  </div>

  <div class="button-row">
    <Button on:click={handleCalculate}>Calculate Shared Secret</Button>
    <Button variant="secondary" on:click={loadExample}>Load Example</Button>
    <Button variant="secondary" on:click={() => { base=""; modulus=""; expA=""; expB=""; result=null; }}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="results-area">
      <div class="step-row">
        <div class="step">
          <span class="label">Alice sends Public Key ($A = g^a \mod p$):</span>
          <span class="value">{result.alicePublic}</span>
        </div>
        <div class="step">
          <span class="label">Bob sends Public Key ($B = g^b \mod p$):</span>
          <span class="value">{result.bobPublic}</span>
        </div>
      </div>

      <div class="final-result" class:success={result.match}>
        <div class="secret-box">
            <span class="label">Calculated Shared Secret:</span>
            <span class="value big">{result.sharedSecret}</span>
        </div>
        {#if result.match}
            <div class="status">✓ Keys Match! Secure Connection Established.</div>
        {:else}
            <div class="status error">✗ Error: Keys do not match.</div>
        {/if}
      </div>
    </div>
  {/if}

</ToolCard>

<Info title="About Diffie-Hellman" links={diffieHellmanLinks}>
  <p>The Diffie-Hellman Key Exchange Algorithm, developed by Whitfield Diffie 
    and Martin Hellman in 1976, is a method for securely exchanging cryptographic 
    keys over a public channel. It's one of the earliest and most widely used 
    public-key protocols and is foundational in securing communications on the internet. </p>

    <p>
    <strong>How it works:</strong>
    </p>

    <ol>
    <li>Both parties agree on a large prime p and a generator g (public values). </li>
    <li>Party A (Alice) chooses a private key a and calculates her public key as A=g^a mod p.</li>
    <li>Party B (Bob) chooses a private key b and calculates his public key as B=g^b mod p.</li>
    <li>Alice and Bob then exchange their public keys.</li>
    <li>Using the received public key, each party can compute the shared secret.</li>
    <li>Alice computes: S= B^a mod p</li>
    <li>Bob computes: S= A^b mod p</li>
    <li>Both values will be the same because of the mathematical property g^ab mod p == g^ba mod p</li>
    </ol>
    <p>
    Diffie-Hellman is widely used in secure protocols such as TLS/SSL, SSH and IPsec. 
    It remains a core technique for key exchange in cryptography, especially 
    when paired with authentication methods to prevent interception and tampering.</p>
  
</Info>

<style>
  .grid-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .section-box {
    border: 1px solid #e2e8f0;
    padding: 1rem;
    border-radius: 8px;
    background: #f8fafc;
  }

  h4 {
    margin: 0 0 0.8rem 0;
    color: #334155;
    font-size: 0.95rem;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.5rem;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .split-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .alice { background: #eff6ff; border-color: #bfdbfe; }
  .bob { background: #f0fdf4; border-color: #bbf7d0; }

  .button-row {
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }

  .results-area {
    margin-top: 0.5rem;
    border-top: 2px solid #e2e8f0;
    padding-top: 1.5rem;
  }

  .step-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .step {
    background: white;
    padding: 0.8rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
  }

  .step .label { display: block; font-size: 1rem; color: #64748b; margin-top: 1rem; }
  .step .value { display: block; font-weight: bold; color: #334155; font-family: monospace; font-size: 2rem; text-align: center;}

  .final-result {
    text-align: center;
    background: #f1f5f9;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
  }

  .final-result.success {
    background: #f0fdf4;
    border-color: #86efac;
  }

  .secret-box .label { font-size: 1.5rem; color: #475569; display: block; margin-top: auto;}
  .secret-box .value.big { font-size: 2rem; color: #0f172a; }

  .status {
    margin-top: 0.5rem;
    font-weight: bold;
    color: #16a34a;
  }
  .status.error { color: #dc2626; }
</style>