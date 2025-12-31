<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import DownloadZipButton from '../../components/DownloadZipButton.svelte';
  
  import { generateSelfSignedCert } from '../../section_tools_js/asymmetric_encryption_js/x509_self_signed.js';

  // form Data
  let formData = {
      commonName: "",
      organization: "",
      locality: "",
      state: "",
      country: "US",
      validDays: "365",
      sanNamesInput: "", // raw string input for SANs
      passphrase: ""
  };

  // state
  let result = null;
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

  // zip
  $: zipData = result ? [
      { name: "certificate.crt", content: result.certificate },
      { name: "private.key", content: result.privateKey },
      { name: "public.key", content: result.publicKey }
  ] : [];

  async function handleGenerate() {
      if (!formData.commonName) {
          error = "Common Name is required.";
          return;
      }

      error = "";
      isGenerating = true;
      result = null;

      // parse SANs
      const sanList = formData.sanNamesInput
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);

      const payload = { ...formData, sanNames: sanList };

      // give UI time to update
      setTimeout(async () => {
          try {
              result = await generateSelfSignedCert(payload);
          } catch (e) {
              error = e.message;
          } finally {
              isGenerating = false;
          }
      }, 50);
  }

  const x509Links = [
      { text: "Wikipedia: X.509", url: "https://en.wikipedia.org/wiki/X.509" },
      {text: "WorkOs", url: "https://workos.com/blog/x509-certificate"}
  ];
</script>

<ToolCard title="X.509 Self-Signed Certificate Generator">
  
  <div class="form-grid">
    <div class="full-width">
        <h4 class="section-title">Identity Information</h4>
    </div>

    <div class="full-width">
        <Input 
            label="Common Name (CN):" 
            bind:value={formData.commonName} 
            placeholder="Required: e.g. localhost or mysite.local" 
        />
    </div>

    <Input 
        label="Organization (O):" 
        bind:value={formData.organization} 
        placeholder="Optional: e.g. My Company" 
    />

    <Input 
        label="Locality / City (L):" 
        bind:value={formData.locality} 
        placeholder="Optional: e.g. San Francisco" 
    />

    <Input 
        label="State / Province (ST):" 
        bind:value={formData.state} 
        placeholder="Optional: e.g. California" 
    />

    <Select 
        label="Country (C):" 
        bind:value={formData.country} 
        options={countries} 
    />

    <div class="full-width">
        <h4 class="section-title">Configuration</h4>
    </div>

    <Input 
        label="Valid Days:" 
        bind:value={formData.validDays} 
        placeholder="365" 
        type="number"
    />

    <div class="full-width">
        <Input 
            label="Subject Alternative Names (SANs):" 
            bind:value={formData.sanNamesInput} 
            placeholder="e.g. localhost, 127.0.0.1 (Comma separated)" 
        />
    </div>

    <div class="full-width">
        <Input 
            label="Private Key Passphrase:" 
            bind:value={formData.passphrase} 
            placeholder="Optional: Leave empty for no encryption" 
            type="password"
        />
    </div>

  </div>

  <div class="button-row" style="margin-top: 1.5rem;">
    <Button on:click={handleGenerate} disabled={isGenerating}>
        {#if isGenerating}Generating Keys & Signing...{:else}Generate Certificate{/if}
    </Button>
    <Button variant="secondary" on:click={() => { result=null; formData.commonName=""; }}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="results-area">
        <div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
            <DownloadZipButton 
               data={zipData} 
               zipName="x509_self_signed_certificate.zip" 
               label="Download All Files" 
            />
        </div>

        <Input 
            label="Certificate (CRT):" 
            value={result.certificate} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            withDownload={true}
            downloadName="certificate.crt"
            rows={5}
        />

        <Input 
            label="Private Key:" 
            value={result.privateKey} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            withDownload={true}
            downloadName="private.key"
            rows={5}
        />

        <Input 
            label="Public Key:" 
            value={result.publicKey} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            withDownload={true}
            downloadName="public.key"
            rows={5}
        />
    </div>
  {/if}

</ToolCard>

<Info title="About Self-Signed Certs" links={x509Links}>
  <p>A <b>self-signed X.509 certificate</b> is a digital certificate that is signed 
    by the same entity it certifies, rather than by a third-party certificate 
    authority (CA). Self-signed certificates are often used in testing, 
    local development, or internal applications where trusted CA validation 
    isn’t necessary. </p>
        
    <p>X.509 is a standard for public key infrastructure (PKI) 
    and defines the format of public key certificates. Each certificate contains 
    a subject, a public key, issuer information, validity dates, and a
    digital signature. In a self-signed certificate, the entity (user or organization) 
    that issues the certificate is also the one that signs it. This means the Issuer 
    and Subject fields are identical. This approach eliminates the need for a CA, 
    making it quick and free to generate but less secure outside of trusted environments. 
    While self-signed certificates provide encryption, they don’t verify 
    the identity of the server. Thus, they should be used only when there’s an implicit 
    trust in the certificate holder, like in private or controlled environments</p>

  <ul>
    <li><strong>Use Cases:</strong> Local development (localhost), internal testing, or private networks.</li>
    <li>Browsers will show a "Not Secure" warning because they don't trust the issuer (you). You must manually trust the cert in your OS/Browser to remove the warning.</li>
    <li><strong>SANs:</strong> Modern browsers (Chrome/Edge) require the domain/IP to be listed in the "Subject Alternative Names" (SAN) field, not just the Common Name.</li>
  </ul>
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

  .section-title {
      margin: 1rem 0 0.5rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
  }

  .results-area {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>