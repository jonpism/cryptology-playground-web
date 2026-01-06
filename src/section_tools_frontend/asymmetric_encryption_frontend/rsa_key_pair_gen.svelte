<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import DownloadZipButton from '../../components/DownloadZipButton.svelte';
  
  import { generateRSAKeyPair } from '../../section_tools_js/asymmetric_encryption_js/rsa_key_pair_gen.js';

  let keySize = 2048; 
  let keyFormat = 'pgp'; 
  let privateKeyResult = "";
  let publicKeyResult = "";
  let error = "";
  let isGenerating = false;

  const sizeOptions = [
    { value: 1024, label: "1024 bit (Legacy/Fast)" },
    { value: 2048, label: "2048 bit (Standard)" },
    { value: 4096, label: "4096 bit (High Security - Slow)" }
  ];

  const formatOptions = [
    { value: 'pgp', label: "PGP Format (.asc) - Best for Email/File Tools" },
    { value: 'pem', label: "PEM Format (.pem) - Raw RSA/SSL/SSH" }
  ];

  $: ext = keyFormat === 'pgp' ? 'asc' : 'pem';

  $: zipData = privateKeyResult ? [
      { name: `private_key.${ext}`, content: privateKeyResult },
      { name: `public_key.${ext}`, content: publicKeyResult }
  ] : [];

  async function handleGenerate() {
    error = "";
    isGenerating = true;
    privateKeyResult = "";
    publicKeyResult = "";

    setTimeout(async () => {
        try {
            const keys = await generateRSAKeyPair(keySize, keyFormat);
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
    { text: "RFC 8017: PKCS #1 v2.2", url: "https://datatracker.ietf.org/doc/html/rfc8017" },
    {text: "Acrobat (.asc files)", url: "https://www.adobe.com/acrobat/resources/document-files/asc-file.html"}
  ];
</script>

<ToolCard title="RSA Key Pair Generator">
  
  <div class="controls-container">
    <div class="row">
      <Select 
        label="Key Size:" 
        bind:value={keySize} 
        options={sizeOptions} 
      />
      <Select 
        label="Output Format:" 
        bind:value={keyFormat} 
        options={formatOptions} 
      />
    </div>
    
    <div class="action-row">
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
            downloadName={`private_key.${ext}`}
            rows={6}
        />

        <Input 
            label="Public Key (Share Freely):" 
            value={publicKeyResult} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            withDownload={true}
            downloadName={`public_key.${ext}`}
            rows={6}
        />

        <div class="download-container">
            <DownloadZipButton 
               data={zipData} 
               zipName={`rsa_keys_${ext}.zip`} 
               label="Download Key Pair (.zip)" 
            />
        </div>
    </div>
  {/if}

</ToolCard>

<Info title="About RSA Key Pair Generator" links={rsaLinks}>
  <p>
    <strong>Which format should I choose?</strong>
  </p>
  <ul>
    <li><strong>PGP (.asc):</strong> Choose this if you want to use these keys with the <em>PGP Encryption Tool</em> on this site, or with software like GPG, ProtonMail, or Kleopatra.</li>
    <li><strong>PEM (.pem):</strong> Choose this for raw cryptographic operations, SSL certificates, or older SSH keys. This is the "naked" RSA key data.</li>
  </ul>
</Info>

<style>
  .controls-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .row :global(div) {
    flex: 1;
    min-width: 200px;
  }

  .action-row {
    display: flex;
    justify-content: center;
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