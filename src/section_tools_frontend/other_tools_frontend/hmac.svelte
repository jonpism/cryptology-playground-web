<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  
  import { processHMAC } from '../../section_tools_js/other_tools_js/hmac.js';

  let message = "";
  let key = "";
  let selectedAlgo = "SHA-256";
  let results = null;
  let error = "";

  const algoOptions = ["SHA-256", "SHA-512", "SHA-224", "SHA-384"];

  function runHMAC() {
    error = "";
    results = null;

    try {
      results = processHMAC(message, key, selectedAlgo);
    } catch (e) {
      error = e.message;
    }
  }

  const infoLinks = [
    { text: "HMAC - Wikipedia", url: "https://en.wikipedia.org/wiki/HMAC" },
    { text: "@noble/hashes - NPM Package", url: "https://www.npmjs.com/package/@noble/hashes#hmac" }
  ];
</script>

<ToolCard title="HMAC Generator">
  
  <Select 
    label="Hashing Algorithm:" 
    bind:value={selectedAlgo} 
    options={algoOptions} 
  />

  <Input 
    label="Message / Data:" 
    bind:value={message} 
    placeholder="e.g. The quick brown fox..." 
  />

  <Input 
    label="Secret Key:" 
    bind:value={key} 
    type="password"
    placeholder="e.g. MySecretKey123" 
  />

  <div class="button-row">
    <Button on:click={runHMAC}>Generate HMAC</Button>
    <Button variant="secondary" on:click={() => {message = ""; key=""; results = null;}}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if results}
    <div class="result-section">
      <div class="result-box">
        <label>HMAC ({selectedAlgo}) Hex:</label>
        <textarea readonly>{results.hex}</textarea>
      </div>
      
      <div class="result-box">
        <label>Base64:</label>
        <textarea readonly>{results.base64}</textarea>
      </div>
    </div>
  {/if}

</ToolCard>

<Info title="About HMAC" links={infoLinks}>
  <p>HMAC (Hash-based Message Authentication Code) is a widely used cryptographic technique that provides message integrity and authenticity. 
    It combines a cryptographic hash function (such as SHA-256 or MD5) with a secret key to generate a unique message authentication code. This 
    code ensures that the message has not been tampered with and verifies the identity of the sender.</p>
    <p>HMAC is commonly used in network security protocols, such as TLS, IPsec, and in API authentication mechanisms, where it helps protect against 
    man-in-the-middle attacks and message alteration.</p>
    <p><strong>How HMAC Works:</strong></p>
    <ol>
    <li>The message to be authenticated is combined with a secret key using a hashing algorithm (like SHA-256 or SHA-512).</li>
    <li>HMAC applies the hashing function twice: once to a modified version of the message combined with the key (inner hash), and then again 
    to another modified version of the key combined with the result of the inner hash (outer hash).</li>
    <li>The final output is the HMAC value, which is used as a signature to authenticate the message.</li>
    </ol>
    <p><strong>Characteristics of HMAC:</strong></p>
    <ul>
    <li><strong>Message Integrity:</strong> HMAC ensures that the message has not been modified during transmission. If any part of the message changes, 
    the HMAC value will also change, allowing the recipient to detect tampering.</li>
    <li><strong>Message Authenticity:</strong> Because HMAC uses a secret key, only those who have the key can generate a valid HMAC. This provides assurance 
    of the sender's authenticity.</li>
    <li><strong>Resilience to Cryptographic Attacks:</strong> HMAC is designed to be secure even when the underlying hash function has some vulnerabilities. 
    The use of a secret key adds an additional layer of protection.</li>
    </ul>
  
</Info>

<style>
  .button-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
  .msg { padding: 1rem; background: #fee2e2; color: #ef4444; border-radius: 6px; margin-bottom: 1rem; }
  .result-box { margin-bottom: 1rem; }
  label { font-weight: bold; display: block; margin-bottom: 0.5rem; color: #334155; }
  textarea {
    width: 100%; height: 60px; padding: 0.8rem;
    border: 1px solid #cbd5e1; border-radius: 6px;
    background: #f8fafc; font-family: monospace; resize: none;
    box-sizing: border-box; color: #334155;
  }
</style>