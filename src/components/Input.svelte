<script>
  export let label = "";
  export let value = "";
  export let files = null;
  export let placeholder = "";
  export let type = "text";
  export let readonly = false;
  export let expandable = false; 
  export let withCopy = false; 
  export let withDownload = false; 
  export let downloadName = "output.txt";

  let copied = false;
  let downloaded = false;

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
      setTimeout(() => (copied = false), 2000); 
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  }

  function handleDownload() {
    if (!value) return;
    try {
      const blob = new Blob([value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      downloaded = true;
      setTimeout(() => (downloaded = false), 2000);
    } catch (err) {
      console.error("Failed to download!", err);
    }
  }
</script>

<div class="input-group">
  {#if label}
    <label for="input-field">{label}</label>
  {/if}
  
  <div class="input-wrapper">
    {#if type === 'file'}
      <input 
        id="input-field"
        type="file" 
        bind:files 
        on:change
      />

    {:else if expandable}
      <textarea 
        id="input-field"
        bind:value 
        {placeholder} 
        {readonly}
        class:has-action={withCopy || withDownload}
        class:has-double-action={withCopy && withDownload}
        rows="1"
        on:input 
        on:change
      ></textarea>

    {:else if type === 'password'}
      <input 
        id="input-field"
        type="password" 
        bind:value 
        {placeholder} 
        {readonly}
        class:has-action={withCopy || withDownload}
        class:has-double-action={withCopy && withDownload}
        on:input 
        on:change
      />
    {:else if type === 'number'}
      <input 
        id="input-field"
        type="number" 
        bind:value 
        {placeholder} 
        {readonly}
        class:has-action={withCopy || withDownload}
        class:has-double-action={withCopy && withDownload}
        on:input 
        on:change
      />
    {:else if type === 'email'}
      <input 
        id="input-field"
        type="email" 
        bind:value 
        {placeholder} 
        {readonly}
        class:has-action={withCopy || withDownload}
        class:has-double-action={withCopy && withDownload}
        on:input 
        on:change
      />
    {:else}
      <input 
        id="input-field"
        type="text" 
        bind:value 
        {placeholder} 
        {readonly}
        class:has-action={withCopy || withDownload}
        class:has-double-action={withCopy && withDownload}
        on:input 
        on:change
      />
    {/if}

    {#if (withCopy || withDownload) && type !== 'file'}
      <div class="actions">
        
        {#if withCopy}
          <button 
            class="action-btn" 
            class:success={copied}
            on:click={handleCopy} 
            title="Copy to clipboard"
            type="button"
          >
            {#if copied}
              <span>✓</span>
            {:else}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            {/if}
          </button>
        {/if}

        {#if withDownload}
          <button 
            class="action-btn" 
            class:success={downloaded}
            on:click={handleDownload} 
            title="Download as file"
            type="button"
          >
            {#if downloaded}
              <span>✓</span>
            {:else}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            {/if}
          </button>
        {/if}

      </div>
    {/if}
  </div>
</div>

<style>
  .input-group { margin-bottom: 1.5rem; width: 100%; }

  label { display: block; font-weight: bold; margin-bottom: 0.5rem; color: #334155; }

  .input-wrapper {
    position: relative;
    width: 100%;
  }
  
  input, textarea { 
    width: 100%; padding: 0.8rem; 
    border: 2px solid #cbd5e1; border-radius: 6px; 
    font-size: 1rem; box-sizing: border-box; 
    background-color: white;
    font-family: inherit;
  }

  /* prevent text overlapping buttons */
  input.has-action, textarea.has-action {
    padding-right: 45px; /* space for 1 button */
  }
  input.has-double-action, textarea.has-double-action {
    padding-right: 80px; /* space for 2 buttons */
  }

  input:focus, textarea:focus { outline: none; border-color: #60a5fa; }
  
  input[type="file"] { padding: 0.5rem; }

  textarea {
    resize: vertical; 
    min-height: 48px; 
    overflow: auto;   
  }

  .actions {
    position: absolute;
    top: 8px;    
    right: 8px;  
    display: flex;
    gap: 5px; /* space between buttons */
  }

  .action-btn {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: all 0.2s;
    height: 30px;
    width: 30px;
  }

  .action-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
    border-color: #94a3b8;
  }

  .action-btn.success {
    color: #16a34a;
    background-color: #dcfce7;
    border-color: #86efac;
    font-weight: bold;
  }
</style>