<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import DownloadZipButton from '../../components/DownloadZipButton.svelte';
  
  import { generateCSR} from '../../section_tools_js/asymmetric_encryption_js/cert_signing_request.js';

  let formData = {
      commonName: "",
      organization: "",
      orgUnit: "",
      locality: "",
      state: "",
      country: "US",
      passphrase: ""
  };

  let privateKeyResult = "";
  let csrResult = "";
  let error = "";
  let isGenerating = false;

  const countries = [
      { value: "US", label: "United States (US)" },
      { value: "GB", label: "United Kingdom (GB)" },
      { value: "CA", label: "Canada (CA)" },
      { value: "DE", label: "Germany (DE)" },
      { value: "FR", label: "France (FR)" },
      { value: "IN", label: "India (IN)" },
      { value: "JP", label: "Japan (JP)" },
      { value: "CN", label: "China (CN)" },
      { value: "BR", label: "Brazil (BR)" },
      { value: "AU", label: "Australia (AU)" }
  ];

  async function handleGenerate() {
      if (!formData.commonName || !formData.organization || !formData.country) {
          error = "Please fill in all required fields (Common Name, Organization, Country).";
          return;
      }

      error = "";
      isGenerating = true;
      privateKeyResult = "";
      csrResult = "";

      setTimeout(async () => {
          try {
              const result = await generateCSR(formData);
              privateKeyResult = result.privateKey;
              csrResult = result.csr;
          } catch (e) {
              error = e.message;
          } finally {
              isGenerating = false;
          }
      }, 50);
  }

  $: zipPayload = [
      { name: "private.key", content: privateKeyResult },
      { name: "request.csr", content: csrResult }
  ];

    const csrLinks = [
      { text: "CSR - Wikipedia", url: "https://en.wikipedia.org/wiki/Certificate_signing_request" },
      { text: "Sectigo", url: "https://www.sectigo.com/resource-library/what-is-a-certificate-signing-request-csr" },
      { text: "node-forge", url: "https://www.npmjs.com/package/node-forge?activeTab=readme" }
  ];
</script>

<ToolCard title="Certificate Signing Request (CSR) Generator">
  
  <div class="form-grid">
    <div class="full-width">
        <Input 
            label="Common Name (Domain Name):" 
            bind:value={formData.commonName} 
            placeholder="e.g. www.example.com" 
        />
    </div>

    <Input 
        label="Organization (O):" 
        bind:value={formData.organization} 
        placeholder="e.g. My Company Ltd" 
    />

    <Input 
        label="Department (OU):" 
        bind:value={formData.orgUnit} 
        placeholder="e.g. IT" 
    />

    <Input 
        label="City / Locality (L):" 
        bind:value={formData.locality} 
        placeholder="e.g. New York" 
    />

    <Input 
        label="State / Province (ST):" 
        bind:value={formData.state} 
        placeholder="e.g. California" 
    />

    <Select 
        label="Country (C):" 
        bind:value={formData.country} 
        options={countries} 
    />

    <Input 
        label="Private Key Passphrase (Optional):" 
        bind:value={formData.passphrase} 
        placeholder="Leave empty for no encryption" 
        type="password"
        />
  </div>

  <div class="button-row" style="margin-top: 1.5rem;">
    <Button on:click={handleGenerate} disabled={isGenerating}>
        {#if isGenerating}Generating Keys...{:else}Generate CSR{/if}
    </Button>
    <Button variant="secondary" on:click={() => { 
        formData = { ...formData, commonName: "", organization: "" }; 
        result = ""; 
    }}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if csrResult}
    <div class="results-area">
    <Input 
        label="Certificate Signing Request (CSR):"
        value={csrResult} 
        readonly={true} 
        rows={6}
        withCopy={true} 
        withDownload={true} 
        downloadName="request.csr" 
        expandable={true}
    />

    <Input 
        label="Private Key:"
        value={privateKeyResult} 
        readonly={true} 
        rows={6}
        withCopy={true} 
        withDownload={true} 
        downloadName="private.key"
        expandable={true}
    />
    <div style="display: flex; justify-content: center; margin-bottom: 1rem;">
           <DownloadZipButton 
              data={zipPayload} 
              zipName="csr_bundle.zip" 
              label="Download All as ZIP"
           />
        </div>

        <div class="result-block">
            </div>
    </div>
  {/if}

</ToolCard>

<Info title="About CSR" links={csrLinks}>
  
  <p>
    A <strong>Certificate Signing Request (CSR)</strong> is the first step to getting an SSL/TLS certificate for your website.
    It is a block of encoded text that an individual
    or organization submits to a Certificate Authority (CA) when applying for a digital
    certificate, like an SSL/TLS certificate. The CSR contains essential information
    that helps the CA generate and authenticate the certificate. The CSR includes
    the public key that corresponds to the private key generated on the applicant’s server.
    This public key will be part of the issued certificate. A CSR is generated and sent
    to a CA to apply for an SSL certificate or other types of digital certificates. The CA
    verifies the details provided in the CSR to ensure they match the organization 
    requesting the certificate. Once the verification process is completed, the CA issues 
    a certificate that the organization can use to secure its communications. 
    CSRs are encoded in PEM or DER format, with PEM being the more common format in practice.
  </p>
  <p>
    <strong>How it works:</strong>
  </p>
  <ol>
    <li>You generate a <strong>Private Key</strong> (which stays on your server) and a <strong>CSR</strong>.</li>
    <li>You send the CSR to a Certificate Authority (like Sectigo, DigiCert, or Let's Encrypt).</li>
    <li>They verify your details and send back a signed <strong>Certificate</strong>.</li>
    <li>You install the Certificate and Private Key on your web server.</li>
  </ol>
  <p>
    <em><b>Note:</b> This tool generates keys locally in your browser. Nothing is sent to any server.</em>
  </p>
</Info>

<style>
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .full-width {
    grid-column: 1 / -1;
  }

  .results-area {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>