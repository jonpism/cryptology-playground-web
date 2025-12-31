<script>
  import JSZip from 'jszip';

  export let data = [];
  export let zipName = "archive.zip";
  export let label = "Download ZIP";
  export let disabled = false;

  let isZipping = false;
  let success = false;

  async function handleZipDownload() {
    if (!data || data.length === 0) return;

    isZipping = true;
    try {
      const zip = new JSZip();

      // add files to the zip
      data.forEach(file => {
        if (file.name && file.content) {
          zip.file(file.name, file.content);
        }
      });

      // generate zip file asynchronously
      const blob = await zip.generateAsync({ type: "blob" });

      // download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      success = true;
      setTimeout(() => (success = false), 2000);
      
    } catch (error) {
      console.error("Failed to zip files:", error);
    } finally {
      isZipping = false;
    }
  }
</script>

<button 
  class="zip-btn" 
  class:success={success} 
  on:click={handleZipDownload} 
  disabled={disabled || isZipping}
>
  {#if isZipping}
    <svg class="spinner" viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
    </svg>
    <span>Compressing...</span>
  {:else if success}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>Downloaded!</span>
  {:else}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="21 8 21 21 3 21 3 8"></polyline>
      <rect x="1" y="3" width="22" height="5"></rect>
      <line x1="10" y1="12" x2="14" y2="12"></line>
    </svg>
    <span>{label}</span>
  {/if}
</button>

<style>
  .zip-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .zip-btn:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .zip-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .zip-btn.success {
    background-color: #10b981;
  }

  .spinner {
    animation: rotate 2s linear infinite;
    width: 18px;
    height: 18px;
  }
  .path {
    stroke: #ffffff;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% { transform: rotate(360deg); }
  }
  @keyframes dash {
    0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
    50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
    100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
  }
</style>