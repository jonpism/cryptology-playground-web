<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Info from '../../components/Info.svelte';
  import Button from '../../components/Button.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { generateFernetKey, encryptFernet, decryptFernet } from '../../section_tools_js/symmetric_encryption_js/fernet_encryption.js';

  let mode = 'encrypt'; // encrypt / decrypt
  
  let key = "";
  let inputText = "";
  let outputResult = "";
  let error = "";
  let autoUpdate = true;

  // auto-generate key on mount
  import { onMount } from 'svelte';
  onMount(() => {
    if (!key) key = generateFernetKey();
  });

  function generateNewKey() {
    key = generateFernetKey();
  }

  function handleAction() {
    error = "";
    outputResult = "";

    if (!key || !inputText) {
        error = "Please provide both a Key and Input Text.";
        return;
    }

    try {
        if (mode === 'encrypt') {
            outputResult = encryptFernet(inputText, key);
        } else {
            outputResult = decryptFernet(inputText, key);
        }
    } catch (e) {
        error = e.message;
    }
  }

  $: if (autoUpdate && inputText) {
      handleAction();
  }

  const fernetLinks = [
      { text: "Fernet Spec (GitHub)", url: "https://github.com/fernet/spec" }
  ];
</script>

<ToolCard title="Fernet Encryption">
    
    <div class="tabs">
        <button class:active={mode === 'encrypt'} on:click={() => {mode = 'encrypt'; error=""; outputResult="";}}>
            Encrypt
        </button>
        <button class:active={mode === 'decrypt'} on:click={() => {mode = 'decrypt'; error=""; outputResult="";}}>
            Decrypt
        </button>
    </div>

    <div class="tool-content">
        
        <div class="form-group">
            <label>Secret Key (32-byte Base64)</label>
            <div class="key-row">
                <input 
                    type="text" 
                    bind:value={key} 
                    placeholder="Paste Fernet Key here..." 
                    class="key-input"
                />
                <button class="gen-btn" on:click={generateNewKey} title="Generate New Key">
                    🎲
                </button>
            </div>
            <small class="hint">Fernet requires a specific 32-byte URL-safe base64 key.</small>
        </div>

        <div class="form-group">
            <label>{mode === 'encrypt' ? 'Plaintext Message' : 'Fernet Token (Ciphertext)'}</label>
            <textarea 
                bind:value={inputText} 
                rows="4" 
                placeholder={mode === 'encrypt' ? 'Type secret message...' : 'Paste gAAAAAB... string'}
            ></textarea>
        </div>

        <div class="action-row">
            <Button on:click={handleAction}>
                {mode === 'encrypt' ? 'Encrypt Message' : 'Decrypt Token'}
            </Button>

            <div style="margin-left: 10px;">
            <Button variant="secondary" on:click={() => {inputText = ""; outputResult = null;}}>Clear</Button>
            </div>

            <div style="margin-left: auto;">
                <AutoUpdateButton bind:checked={autoUpdate} />
            </div>
        </div>

        {#if error}
            <div class="msg error">{error}</div>
        {/if}

        {#if outputResult}
            <div class="result-area">
                <label>{mode === 'encrypt' ? 'Encrypted Token:' : 'Decrypted Message:'}</label>
                <textarea readonly rows="4" value={outputResult} class="result-box"></textarea>
                <small>Result copied to clipboard automatically (optional logic)</small>
            </div>
        {/if}

    </div>

</ToolCard>

<Info title="About Fernet" links={fernetLinks}>
    <p>This application uses <b>Fernet</b> from the <a href="https://www.npmjs.com/package/fernet">npm package</a>. 
    Fernet encryption is a method of symmetric encryption that provides both confidentiality and authentication for data. 
    It uses a secret key to encrypt and decrypt messages, ensuring that only authorized parties can access the original information.</p>
    <ul>
    <li><b>Encryption:</b> Enter plaintext and click Encrypt to generate an encrypted message</li>
    <li><b>Decryption:</b> Paste the encrypted message and key, then click Decrypt to recover the original plaintext.</li>
    <li><b>Randomness:</b> Generates a new IV (Initialization Vector) every time, so encrypting "Hello" twice results in different tokens.</li>
    </ul>
    <p><b>Note:</b> Fernet uses AES in CBC mode with HMAC for authentication.</p>
        
</Info>

<style>
    .tabs {
        display: flex;
        margin-bottom: 1.5rem;
        background: #cbd5e1;
        border-radius: 8px;
        padding: 4px;
        gap: 4px;
    }
    .tabs button {
        flex: 1;
        padding: 10px;
        background: transparent;
        color: #475569;
        border: none;
        cursor: pointer;
        font-weight: bold;
        border-radius: 6px;
        transition: all 0.2s;
    }
    .tabs button.active {
        background: #fff;
        color: #0f172a;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .form-group { margin-bottom: 1.5rem; }
    label { display: block; font-weight: bold; color: #334155; margin-bottom: 0.5rem; }
    
    textarea, .key-input {
        width: 100%;
        padding: 0.8rem;
        border: 2px solid #cbd5e1;
        border-radius: 6px;
        font-family: monospace;
        background: white;
        box-sizing: border-box;
    }
    textarea:focus, .key-input:focus { outline: none; border-color: #3b82f6; }

    .key-row { display: flex; gap: 0.5rem; }
    .gen-btn {
        padding: 0 1rem;
        font-size: 1.2rem;
        cursor: pointer;
        background: #e2e8f0;
        border: 2px solid #cbd5e1;
        border-radius: 6px;
    }
    .gen-btn:hover { background: #cbd5e1; }
    .hint { font-size: 0.85rem; color: #64748b; margin-top: 4px; display: block; }

    .result-box {
        background: #f0fdf4;
        border-color: #86efac;
        color: #166534;
    }
    
    .msg.error {
        margin-top: 1rem;
        padding: 1rem;
        background: #fee2e2;
        color: #dc2626;
        border-radius: 6px;
        text-align: center;
    }
    
    .action-row {
        display: flex;
        justify-content: center;
    }
</style>