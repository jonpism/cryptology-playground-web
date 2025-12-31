<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import DownloadZipButton from '../../components/DownloadZipButton.svelte';
  
  import { generateRSAKeyPair } from '../../section_tools_js/asymmetric_encryption_js/rsa_key_pair_gen.js';

  let keySize = 2048; // default standard
  
  let privateKeyResult = "";
  let publicKeyResult = "";
  let error = "";
  let isGenerating = false;

  const sizeOptions = [
    { value: 1024, label: "1024 bit (Legacy/Fast)" },
    { value: 2048, label: "2048 bit (Standard)" },
    { value: 4096, label: "4096 bit (High Security - Slow)" }
  ];

  // prepare zip
  $: zipData = privateKeyResult ? [
      { name: "private.pem", content: privateKeyResult },
      { name: "public.pem", content: publicKeyResult }
  ] : [];

  async function handleGenerate() {
    error = "";
    isGenerating = true;
    privateKeyResult = "";
    publicKeyResult = "";

    // small timeout to allow UI to update "Generating..." state
    setTimeout(async () => {
        try {
            const keys = await generateRSAKeyPair(keySize);
            privateKeyResult = keys.privateKey;
            publicKeyResult = keys.publicKey;
        } catch (e) {
            error = "Generation Failed: " + e.message;
        } finally {
            isGenerating = false;
        }
    }, 50);
  }

  const rsaLinks = [
    { text: "Wikipedia: RSA (Cryptosystem)", url: "https://en.wikipedia.org/wiki/RSA_(cryptosystem)" },
    { text: "RFC 8017: PKCS #1 v2.2", url: "https://datatracker.ietf.org/doc/html/rfc8017" }
  ];
</script>

<ToolCard title="RSA Key Pair Generator">
  
  <div class="controls-row">
    <Select 
      label="Key Size (Bits):" 
      bind:value={keySize} 
      options={sizeOptions} 
    />
    
    <div style="align-self: flex-end; margin-bottom: 20px;">
       <Button on:click={handleGenerate} disabled={isGenerating}>
         {#if isGenerating}Generating Keys...{:else}Generate Key Pair{/if}
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
            downloadName="private.pem"
            rows={6}
        />

        <Input 
            label="Public Key (Share Freely):" 
            value={publicKeyResult} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            withDownload={true}
            downloadName="public.pem"
            rows={6}
        />

        <div class="download-container">
            <DownloadZipButton 
               data={zipData} 
               zipName="rsa_keys.zip" 
               label="Download Key Pair (.zip)" 
            />
        </div>
    </div>
  {/if}

</ToolCard>

<Info title="About RSA Keys" links={rsaLinks}>
  <p>
    <strong>RSA Keys</strong> are the foundation of internet security (SSL/TLS, SSH).
  </p>

  <ul>
    <li><strong>1024 bit:</strong> Fast, but considered weak by modern standards. Avoid for sensitive data.</li>
    <li><strong>2048 bit:</strong> The current industry standard. Good balance of security and performance.</li>
    <li><strong>4096 bit:</strong> Extremely secure, but significantly slower to generate and use. Used for top-secret data or root certificates.</li>
  </ul>
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