<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import SwapButton from '../../components/SwapButton.svelte';
  
  import { signECDSA, verifyECDSA } from '../../section_tools_js/asymmetric_encryption_js/ecdsa.js';

  // mode: sign or verify
  let mode = "sign";
  
  // inputs
  let message = "";
  let keyInput = "";      // private key for sign, public key for verify
  let signatureInput = ""; // only for verify
  
  // settings
  let selectedCurve = "P-256";
  let hashAlgo = "SHA-256";
  
  // outputs
  let resultOutput = "";
  let verificationStatus = null; // true/false/null
  let error = "";
  let isProcessing = false;

  const modeOptions = [
    { value: "sign", label: "Sign Message" },
    { value: "verify", label: "Verify Signature" }
  ];

  const curveOptions = [
    { value: "P-256", label: "P-256 (Standard)" },
    { value: "P-384", label: "P-384 (High Security)" },
    { value: "P-521", label: "P-521 (Ultra High)" }
  ];

  const hashOptions = [
    { value: "SHA-256", label: "SHA-256" },
    { value: "SHA-384", label: "SHA-384" },
    { value: "SHA-512", label: "SHA-512" }
  ];

  async function handleProcess() {
    error = "";
    resultOutput = "";
    verificationStatus = null;
    isProcessing = true;

    try {
        if (mode === 'sign') {
            if (!keyInput) throw new Error("Please provide a Private Key (PEM).");
            // signing
            resultOutput = await signECDSA(keyInput, message, selectedCurve, hashAlgo);
        } else {
            if (!keyInput) throw new Error("Please provide a Public Key (PEM).");
            if (!signatureInput) throw new Error("Please provide a Signature (Hex).");
            // verification
            verificationStatus = await verifyECDSA(keyInput, signatureInput, message, selectedCurve, hashAlgo);
        }
    } catch (e) {
        error = "Operation Failed: " + e.message;
        console.error(e);
    } finally {
        isProcessing = false;
    }
  }

  function toggleMode() {
      mode = (mode === 'sign') ? 'verify' : 'sign';
      error = "";
      resultOutput = "";
      verificationStatus = null;
  }

  const ecdsaLinks = [
    { text: "ECDSA - Wikipedia", url: "https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm" },
    { text: "RFC 6090 - ECDSA", url: "https://datatracker.ietf.org/doc/html/rfc6090" },
    { text: "NIST FIPS 186-4", url: "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-4.pdf" }
  ];
</script>

<ToolCard title="ECDSA Sign & Verify">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <Select 
      label="Curve:" 
      bind:value={selectedCurve} 
      options={curveOptions} 
    />
    
    <Select 
      label="Hash Algorithm:" 
      bind:value={hashAlgo} 
      options={hashOptions} 
    />
  </div>

  <Input 
    label="Message:" 
    bind:value={message} 
    placeholder="Enter the text content here..." 
    expandable={true} 
    rows={2}
  />

  <Input 
    label={mode === 'sign' ? "Private Key (PEM):" : "Public Key (PEM):"}
    bind:value={keyInput} 
    placeholder={mode === 'sign' ? "-----BEGIN PRIVATE KEY-----..." : "-----BEGIN PUBLIC KEY-----..."}
    expandable={true} 
    rows={4}
  />

  {#if mode === 'verify'}
    <Input 
        label="Signature to Verify (Hex):" 
        bind:value={signatureInput} 
        placeholder="e.g. 30450221..." 
        expandable={true}
    />
  {/if}

  <div class="button-row">
    <Button on:click={handleProcess} disabled={isProcessing}>
      {#if isProcessing}Processing...{:else}{mode === 'sign' ? 'Sign Message' : 'Verify Signature'}{/if}
    </Button>
    <Button variant="secondary" on:click={() => { 
        message=""; keyInput=""; signatureInput=""; resultOutput=""; verificationStatus=null; 
    }}>Clear</Button>
    <SwapButton on:click={toggleMode} />
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if mode === 'sign' && resultOutput}
    <Input 
        label="Generated Signature (Hex):" 
        value={resultOutput} 
        readonly={true} 
        expandable={true} 
        withCopy={true}
    />
  {/if}

  {#if mode === 'verify' && verificationStatus !== null}
    <div class="result-box">
        <div class="status-bar" class:valid={verificationStatus}>
            <span>Verification Result:</span>
            <strong>{verificationStatus ? "VALID SIGNATURE" : "INVALID SIGNATURE"}</strong>
        </div>
        {#if verificationStatus}
             <p class="status-text valid">The message content matches the signature.</p>
        {:else}
             <p class="status-text invalid">The signature does not match this message or key.</p>
        {/if}
    </div>
  {/if}

</ToolCard>

<Info title="About ECDSA" links={ecdsaLinks}>

  <p>The <b>Elliptic Curve Digital Signature Algorithm (ECDSA)</b> is a cryptographic algorithm 
  used to create and verify digital signatures. ECDSA allows you to prove authenticity without revealing your private key.
  It's based on elliptic curve cryptography (ECC), which offers a high level of security with smaller key sizes compared to 
  traditional algorithms like RSA. ECDSA’s compact and secure design has made it a 
  fundamental part of modern cryptography, particularly where performance, security 
  and small data size are essential.</p>

  <ul>
    <li><strong>Sign (Alice):</strong> Uses a <em>Private Key</em> to generate a signature for a specific message.</li>
    <li><strong>Verify (Bob):</strong> Uses Alice's <em>Public Key</em> to check if the signature is valid for that message.</li>
  </ul>
  <p>
    <em><b>Note:</b> Ensure you select the correct Curve and Hash algorithm used during key generation.</em>
  </p>
</Info>

<style>
  .controls-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
  }

  .result-box {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    text-align: center;
  }

  .status-bar {
    background: #f1f5f9;
    padding: 1rem;
    border-radius: 6px;
    font-size: 1.1rem;
    color: #64748b;
    border: 1px solid #cbd5e1;
    display: inline-block;
    min-width: 250px;
  }

  .status-bar.valid {
    background: #f0fdf4;
    color: #15803d;
    border-color: #86efac;
  }
  
  .status-text { margin-top: 0.5rem; font-size: 0.9rem; }
  .status-text.valid { color: #15803d; }
  .status-text.invalid { color: #dc2626; }

  @media (max-width: 600px) {
    .controls-row { grid-template-columns: 1fr; }
  }
</style>