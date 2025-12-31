<script>
  export let text = "";          // content to download
  export let filename = "download.txt"; // default filename
  export let mimeType = "text/plain";   // MIME type

  let downloaded = false;

  function handleDownload() {
    if (!text) return;

    try {
      // Blob from the text
      const blob = new Blob([text], { type: mimeType });
      
      // temporary URL
      const url = URL.createObjectURL(blob);
      
      // hidden link
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // trigger animation
      downloaded = true;
      setTimeout(() => {
        downloaded = false;
      }, 2000);
    } catch (e) {
      console.error("Download failed:", e);
    }
  }
</script>

<button 
  class="download-btn" 
  class:success={downloaded} 
  on:click={handleDownload}
  title="Download to file"
  type="button"
>
  {#if downloaded}
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  {/if}
</button>

<style>
  .download-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 4px;
    color: #94a3b8;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .download-btn:hover {
    color: #3b82f6;
    background-color: #eff6ff;
  }

  .download-btn.success {
    color: #10b981;
  }

  .download-btn:active {
    transform: translateY(1px);
  }
</style>