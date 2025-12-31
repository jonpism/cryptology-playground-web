<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  
  import { rsaEncrypt, rsaDecrypt, rsaSign, rsaVerify } from '../../section_tools_js/asymmetric_encryption_js/rsa.js';

  let mode = "encrypt"; // encrypt, decrypt, sign, verify
  let message = "";       // plaintext (for Encrypt/Sign/Verify)
  let keyInput = "";      // PEM key
  let cryptoInput = "";   // ciphertext or signature (Base64)
  
  let outputResult = "";
  let verifyStatus = null;
  let error = "";
  let isProcessing = false;

  const modeOptions = [
    { value: "encrypt", label: "Encrypt Message" },
    { value: "decrypt", label: "Decrypt Ciphertext" },
    { value: "sign",    label: "Sign Message" },
    { value: "verify",  label: "Verify Signature" }
  ];

  // determine if we need a Private or Public key
  $: isPrivateKeyNeeded = (mode === 'decrypt' || mode === 'sign');

  // determine labels
  $: keyLabel = isPrivateKeyNeeded ? "Private Key (PEM):" : "Public Key (PEM):";
  $: keyPlaceholder = isPrivateKeyNeeded 
      ? "-----BEGIN RSA PRIVATE KEY-----..." 
      : "-----BEGIN PUBLIC KEY-----...";

  async function handleProcess() {
    error = "";
    outputResult = "";
    verifyStatus = null;
    isProcessing = true;

    try {
        if (!keyInput) throw new Error("Please provide a PEM Key.");

        switch (mode) {
            case 'encrypt':
                if (!message) throw new Error("Please enter a message.");
                outputResult = await rsaEncrypt(keyInput, message);
                break;

            case 'decrypt':
                if (!cryptoInput) throw new Error("Please enter the Ciphertext (Base64).");
                outputResult = await rsaDecrypt(keyInput, cryptoInput);
                break;

            case 'sign':
                if (!message) throw new Error("Please enter a message.");
                outputResult = await rsaSign(keyInput, message);
                break;

            case 'verify':
                if (!message) throw new Error("Please enter the original message.");
                if (!cryptoInput) throw new Error("Please enter the Signature (Base64).");
                verifyStatus = await rsaVerify(keyInput, cryptoInput, message);
                break;
        }

    } catch (e) {
        error = e.message;
    } finally {
        isProcessing = false;
    }
  }

  function clearAll() {
      message = "";
      cryptoInput = "";
      keyInput = "";
      outputResult = "";
      verifyStatus = null;
      error = "";
  }

  const rsaLinks = [
    { text: "Wikipedia: RSA (Cryptosystem)", url: "https://en.wikipedia.org/wiki/RSA_(cryptosystem)" },
    { text: "RFC 8017: PKCS #1 v2.2", url: "https://datatracker.ietf.org/doc/html/rfc8017" },
    { text: "node-forge npm package", url: "https://www.npmjs.com/package/node-forge?activeTab=readme#rsa" }
  ];
</script>

<ToolCard title="RSA Cryptosystem">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={keyLabel}
    bind:value={keyInput} 
    placeholder={keyPlaceholder}
    expandable={true} 
    rows={4}
  />

  {#if mode !== 'decrypt'}
      <Input 
        label="Message / Plaintext:" 
        bind:value={message} 
        placeholder="Enter text..." 
        expandable={true} 
        rows={2}
      />
  {/if}

  {#if mode === 'decrypt'}
      <Input 
        label="Ciphertext (Base64):" 
        bind:value={cryptoInput} 
        placeholder="Enter encrypted data..." 
        expandable={true} 
        rows={3}
      />
  {/if}

  {#if mode === 'verify'}
      <Input 
        label="Signature (Base64):" 
        bind:value={cryptoInput} 
        placeholder="Enter signature..." 
        expandable={true} 
        rows={3}
      />
  {/if}

  <div class="button-row">
    <Button on:click={handleProcess} disabled={isProcessing}>
      {#if isProcessing}Processing...{:else}{modeOptions.find(m=>m.value===mode).label}{/if}
    </Button>
    <Button variant="secondary" on:click={clearAll}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if outputResult}
    <Input 
        label={mode === 'encrypt' ? "Encrypted Output (Base64):" : 
               mode === 'sign' ? "Generated Signature (Base64):" : 
               "Decrypted Message:"} 
        value={outputResult} 
        readonly={true} 
        expandable={true} 
        withCopy={true}
        rows={4}
    />
  {/if}

  {#if mode === 'verify' && verifyStatus !== null}
    <div class="result-box">
        <div class="status-bar" class:valid={verifyStatus}>
            <span>Verification Result:</span>
            <strong>{verifyStatus ? "VALID" : "INVALID"}</strong>
        </div>
        <p class="status-text">
            {verifyStatus ? "The signature matches the message and key." : "Verification failed."}
        </p>
    </div>
  {/if}

</ToolCard>

<Info title="About RSA" links={rsaLinks}>
  
  <p>
    <strong>RSA (Rivest–Shamir–Adleman)</strong> is a widely used public-key cryptosystem 
    for secure data transmission. RSA allows for both confidential communication (Encryption) and authentication (Signing).
  </p>
  <ul>
    <li><strong>Encrypt:</strong> Use the recipient's <em>Public Key</em>. Only they can decrypt it.</li>
    <li><strong>Decrypt:</strong> Use your <em>Private Key</em> to read messages sent to you.</li>
    <li><strong>Sign:</strong> Use your <em>Private Key</em> to prove a message came from you.</li>
    <li><strong>Verify:</strong> Use the sender's <em>Public Key</em> to check their signature.</li>
  </ul>
</Info>

<style>
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
  
  .status-text { margin-top: 0.5rem; color: #64748b; font-size: 0.9rem; }
</style>