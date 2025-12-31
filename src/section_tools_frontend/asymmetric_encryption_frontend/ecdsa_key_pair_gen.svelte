<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import DownloadZipButton from '../../components/DownloadZipButton.svelte';
  
  import { generateECDSAKeyPair } from '../../section_tools_js/asymmetric_encryption_js/ecdsa_key_pair_gen.js';

  let selectedCurve = "P-256";
  
  let privateKeyResult = "";
  let publicKeyResult = "";
  let error = "";
  let isGenerating = false;

  const curveOptions = [
    { value: "P-256", label: "P-256 (Standard - 256 bits)" },
    { value: "P-384", label: "P-384 (High Security - 384 bits)" },
    { value: "P-521", label: "P-521 (Ultra High - 521 bits)" }
  ];

  // prepare zip
  $: zipData = privateKeyResult ? [
      { name: "private_key.pem", content: privateKeyResult },
      { name: "public_key.pem", content: publicKeyResult }
  ] : [];

  async function handleGenerate() {
    error = "";
    isGenerating = true;
    privateKeyResult = "";
    publicKeyResult = "";

    try {
        const keys = await generateECDSAKeyPair(selectedCurve);
        privateKeyResult = keys.privateKey;
        publicKeyResult = keys.publicKey;
    } catch (e) {
        error = "Generation Failed: " + e.message;
    } finally {
        isGenerating = false;
    }
  }
</script>

<ToolCard title="ECDSA Key Generator">
  
  <div class="controls-row">
    <Select 
      label="Elliptic Curve:" 
      bind:value={selectedCurve} 
      options={curveOptions} 
    />
    
    <div style="align-self: flex-end; margin-bottom: 20px;">
       <Button on:click={handleGenerate} disabled={isGenerating}>
         {#if isGenerating}Generating...{:else}Generate New Key Pair{/if}
       </Button>
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if privateKeyResult}
    <div class="results-area">

        <Input 
            label="Private Key (Keep Secret):" 
            value={privateKeyResult} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            withDownload={true}
            downloadName="private_key.pem"
            rows={5}
        />

        <Input 
            label="Public Key (Share Freely):" 
            value={publicKeyResult} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            withDownload={true}
            downloadName="public_key.pem"
            rows={5}
        />

        <div class="download-container">
            <DownloadZipButton 
               data={zipData} 
               zipName="ecdsa_keys.zip" 
               label="Download Key Pair (.zip)" 
            />
        </div>
    </div>
  {/if}

</ToolCard>

<Info title="About ECDSA Keys">
  <p>
    <strong>Elliptic Curve Digital Signature Algorithm (ECDSA)</strong> keys are used to sign data and verify authenticity.
  </p>
  
  <ul>
    <li><strong>Private Key:</strong> Used to create signatures. Must never be shared.</li>
    <li><strong>Public Key:</strong> Distributed to others so they can verify your signatures.</li>
  </ul>
  <p>
    <strong>Which Curve?</strong><br>
    <em>P-256</em> is the standard for most web applications (SSL, JWT). <em>P-384</em> is used for higher security requirements (Top Secret classification).
  </p>
</Info>

<style>
  .controls-row {
    display: flex;
    gap: 1rem;
    align-items: center;
    max-width: 500px;
  }

  .results-area {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .download-container {
      display: flex;
      justify-content: center;
      margin-bottom: 0.5rem;
  }
</style>