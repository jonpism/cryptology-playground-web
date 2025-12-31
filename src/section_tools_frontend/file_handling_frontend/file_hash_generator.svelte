<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import FileDropArea from '../../components/FileDropArea.svelte';
  
  import { generateFileHashes } from '../../section_tools_js/file_handling_js/file_hash_generator.js';

  let selectedFile = null;
  let result = null;
  let error = "";
  let isProcessing = false;

  function handleFileChange(event) {
      // FileDropArea returns a FileList in event.detail
      const files = event.detail;
      if (files && files.length > 0) {
          selectedFile = files[0];
          result = null;
          error = "";
      }
  }

  async function handleGenerate() {
      if (!selectedFile) {
          error = "Please select a file first.";
          return;
      }

      isProcessing = true;
      error = "";
      result = null;

      try {
          // Give UI a moment to render loading state
          await new Promise(r => setTimeout(r, 50));
          result = await generateFileHashes(selectedFile);
      } catch (e) {
          error = e.message;
      } finally {
          isProcessing = false;
      }
  }

  function downloadReport() {
      if (!result) return;
      
      const content = `FILE HASH REPORT
        ------------------------------------------------
        File:      ${result.fileName}
        Size:      ${result.fileSize} bytes
        Time:      ${result.timeTaken} seconds
        Generated: ${new Date().toLocaleString()}

        MD5:
        ${result.hashes.md5}

        SHA-1:
        ${result.hashes.sha1}

        SHA-256:
        ${result.hashes.sha256}

        SHA-512:
        ${result.hashes.sha512}
        ------------------------------------------------`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${result.fileName}_hashes.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  const fileVerificationLinks = [{text: "File Verification - Wikipedia", url: "https://en.wikipedia.org/wiki/File_verification"}];
</script>

<ToolCard title="File Hash Generator">
  
  <div class="drop-container">
      <FileDropArea 
          label="Select File to Hash" 
          on:change={handleFileChange} 
      />
  </div>

  {#if selectedFile}
      <div class="file-status">
          📄 <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
      </div>
  {/if}

  <div class="button-row" style="justify-content: center;">
      <Button on:click={handleGenerate} disabled={isProcessing || !selectedFile}>
          {#if isProcessing}Calculating Hashes...{:else}Generate Hashes{/if}
      </Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="results-area">
        <div class="meta-info">
            <span>Time: {result.timeTaken}s</span>
            <button class="link-btn" on:click={downloadReport}>Download Report</button>
        </div>

        <div class="hash-group">
            <label>MD5</label>
            <input type="text" readonly value={result.hashes.md5} on:click={(e) => e.target.select()} />
        </div>

        <div class="hash-group">
            <label>SHA-1</label>
            <input type="text" readonly value={result.hashes.sha1} on:click={(e) => e.target.select()} />
        </div>

        <div class="hash-group">
            <label>SHA-256</label>
            <input type="text" readonly value={result.hashes.sha256} on:click={(e) => e.target.select()} />
        </div>

        <div class="hash-group">
            <label>SHA-512</label>
            <textarea readonly rows="2" on:click={(e) => e.target.select()}>{result.hashes.sha512}</textarea>
        </div>
    </div>
  {/if}

</ToolCard>

<Info title="About File Hashes" links = {fileVerificationLinks}>
  <p>
    The <b>File Hash Generator</b> calculates cryptographic hash values 
        for any file. Hashes are unique digital fingerprints used to verify 
        file integrity and detect tampering.
    Use this tool to confirm that files are identical or unaltered after download, transfer, or modification.
  </p>
  
  <h3>Supported Algorithms:</h3>
        <ul>
          <li><b>MD5</b>: Fast, legacy checksum</li>
          <li><b>SHA-1</b>: Commonly used for file verification</li>
          <li><b>SHA-256</b>: Modern secure hash standard</li>
          <li><b>SHA-512</b>: High-strength variant for sensitive data</li>
        </ul>
    
        <p>
    <em><b>Note:</b> NO FILES OR FOLDERS are sent to any server. Uploading happens only in your browser.</em>
  </p>
</Info>

<style>
  .drop-container {
      margin-bottom: 1rem;
  }

  .file-status {
      text-align: center;
      margin-bottom: 1.5rem;
      padding: 0.5rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      color: #334155;
  }

  .results-area {
      margin-top: 2rem;
      border-top: 2px solid #e2e8f0;
      padding-top: 1rem;
  }

  .meta-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #64748b;
  }

  .link-btn {
      background: none;
      border: none;
      color: #3b82f6;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
  }

  .hash-group {
      margin-bottom: 1rem;
  }

  .hash-group label {
      display: block;
      font-weight: bold;
      color: #1e293b;
      font-size: 0.8rem;
      margin-bottom: 0.3rem;
  }

  .hash-group input, .hash-group textarea {
      width: 100%;
      padding: 0.6rem;
      font-family: monospace;
      font-size: 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #f1f5f9;
      color: #334155;
  }

  .hash-group input:focus, .hash-group textarea:focus {
      border-color: #3b82f6;
      outline: none;
      background: #fff;
  }
</style>