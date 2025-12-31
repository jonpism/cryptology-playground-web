<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import FileDropArea from '../../components/FileDropArea.svelte';
  
  import { detectFileType, getHexHeader } from '../../section_tools_js/file_handling_js/file_type_detector.js';

  let selectedFile = null;
  let result = null;
  let headerHex = "";
  let error = "";
  let isProcessing = false;

  function handleFileChange(event) {
      if (event.detail && event.detail.length > 0) {
          selectedFile = event.detail[0];
          resetState();
      }
  }

  function resetState() {
      result = null;
      headerHex = "";
      error = "";
  }

  async function handleDetect() {
      if (!selectedFile) {
          error = "Please select a file first.";
          return;
      }

      isProcessing = true;
      resetState();

      try {
          await new Promise(r => setTimeout(r, 50));
          
          // parallel execution for speed
          const [detectionResult, hexResult] = await Promise.all([
              detectFileType(selectedFile),
              getHexHeader(selectedFile)
          ]);

          result = detectionResult;
          headerHex = hexResult;

      } catch (e) {
          error = e.message;
      } finally {
          isProcessing = false;
      }
  }

  const Links = [{text: "List of file signatures (magic bytes) - Wikipedia", url: "https://en.wikipedia.org/wiki/List_of_file_signatures"}];
</script>

<ToolCard title="File Type Detector">
  
  <div class="drop-container">
      <FileDropArea label="Select File to Analyze" on:change={handleFileChange} />
  </div>

  {#if selectedFile}
      <div class="file-badge">
          📄 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
      </div>
  {/if}

  <div class="button-row">
      <Button on:click={handleDetect} disabled={isProcessing || !selectedFile}>
          {#if isProcessing}Analyzing...{:else}Detect File Type{/if}
      </Button>
      <Button variant="secondary" on:click={() => { selectedFile=null; resetState(); }}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="results-area">
        
        <div class="section-label">Magic Bytes (First 16 bytes):</div>
        <div class="hex-box">{headerHex} ...</div>

        <div class="section-label">Analysis Results:</div>
        
        {#if result.matches.length > 0}
            <div class="match-list">
                {#each result.matches as match}
                    <div class="match-card">
                        <div class="match-header">
                            <span class="match-name">{match.name}</span>
                            <span class="match-ext">{match.ext}</span>
                        </div>
                        <div class="match-detail">
                            <span class="label">MIME Type:</span> {match.mime}
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="no-match">
                <strong>Unknown Format</strong>
                <p>The file signature did not match any known types in our database. It might be a plain text file or a proprietary binary format.</p>
            </div>
        {/if}

        {#if result.matches.length > 0 && !result.fileName.toLowerCase().endsWith(result.matches[0].ext.toLowerCase())}
             <div class="warning-box">
                <strong>Mismatch Detected:</strong> This file has a <code>{result.fileName.split('.').pop()}</code> extension, but the magic bytes indicate it is a <strong>{result.matches[0].ext}</strong> file.
             </div>
        {/if}

        <div class="browser-hint">
            <strong>Browser detected:</strong> {result.claimedType || "n/a"}
        </div>

    </div>
  {/if}

</ToolCard>

<Info title="About Magic Bytes" links={Links}>
  The <b>File Type Detector Tool</b> is a utility designed to identify the possible file type 
    of any selected file by analyzing its binary signature, also known as <i>magic bytes</i>.
    It uses the robust <a href="https://www.npmjs.com/package/file-type-checker" target="_blank" rel="noreferrer">file-type-checker</a> library.
</Info>

<style>

  .file-badge {
      text-align: center;
      margin-bottom: 1.5rem;
      padding: 0.5rem;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      color: #334155;
      font-size: 0.9rem;
  }

  .section-label {
      font-weight: bold;
      color: #475569;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
  }

  .hex-box {
      background: #0f172a;
      color: #38bdf8;
      font-family: monospace;
      padding: 0.8rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      word-spacing: 0.5rem;
      font-size: 0.9rem;
      overflow-x: auto;
  }


  .match-card {
      background: #f0fdf4;
      border: 1px solid #86efac;
      padding: 1rem;
      border-radius: 6px;
  }

  .match-name {
      font-weight: bold;
      color: #166534;
      font-size: 1.1rem;
  }
  
  .match-detail .label { font-weight: bold; color: #475569; }

  .no-match {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fcd34d;
      padding: 1rem;
      border-radius: 6px;
      font-size: 0.95rem;
  }

  .warning-box {
      margin-top: 1rem;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      color: #b91c1c;
      padding: 0.8rem;
      border-radius: 6px;
      font-size: 0.9rem;
  }

  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
  }
</style>