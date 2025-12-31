<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processPemDer } from '../../section_tools_js/converters_js/pem_der_converter.js';

  let inputText = "";
  let mode = "pem2der"; // 'pem2der' or 'der2pem'
  
  let selectedHeader = "CERTIFICATE";
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "pem2der", label: "PEM to DER (Hex)" },
    { value: "der2pem", label: "DER (Hex) to PEM" }
  ];

  const headerOptions = [
    { value: "CERTIFICATE", label: "Certificate (X.509)" },
    { value: "PUBLIC KEY", label: "Public Key" },
    { value: "PRIVATE KEY", label: "Private Key" },
    { value: "RSA PRIVATE KEY", label: "RSA Private Key" },
    { value: "CERTIFICATE REQUEST", label: "CSR (Request)" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processPemDer(inputText, mode, selectedHeader);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'pem2der') ? 'der2pem' : 'pem2der';
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode || selectedHeader)) {
      runConverter();
  }

  const pemderLinks = [
    { text: "PEM - Wikipedia", url: "https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail" },
    { text: "DER - Wikipedia", url: "https://en.wikipedia.org/wiki/X.690#DER_encoding" },
  ];
</script>

<ToolCard title="PEM / DER Converter">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />

    {#if mode === 'der2pem'}
      <Select 
        label="PEM Header Type:" 
        bind:value={selectedHeader} 
        options={modeOptions ? headerOptions : []} 
      />
    {/if}
  </div>

  <Input 
    label={mode === 'pem2der' ? "Input PEM:" : "Input DER (Hex):"}
    bind:value={inputText} 
    placeholder={mode === 'pem2der' ? "-----BEGIN CERTIFICATE-----..." : "e.g. 308201..."} 
    expandable={true}
    rows={6}
  />

  <div class="button-row">
    <Button on:click={runConverter}>Convert</Button>
    <Button variant="secondary" on:click={() => { inputText = ""; result = ""; }}>Clear</Button>
    <SwapButton on:click={swapModes} />
    
    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <Input 
      label={mode === 'pem2der' ? "DER Output (Hex):" : "PEM Output:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
      rows={6}
    />
  {/if}

</ToolCard>

<Info title="About PEM & DER" links={pemderLinks}>
  <p>
    <strong>PEM (Privacy Enhanced Mail)</strong> is the most common format for certificates and keys. 
    It is essentially Base64 encoded data wrapped in header/footer lines.
  </p>
  
  <p>
    <strong>DER (Distinguished Encoding Rules)</strong> is the binary version of that data. 
    It is what the computer actually uses to parse the ASN.1 structure of the certificate.
  </p>
  <ul>
    <li><strong>PEM:</strong> Used by Apache, Nginx, and OpenSSL CLI.</li>
    <li><strong>DER:</strong> Used by Java and Windows internals.</li>
  </ul>
  <p>
    Use this tool to convert a binary hex dump back into a usable certificate file, or to strip a certificate down to its raw hex bytes for analysis.
  </p>
</Info>