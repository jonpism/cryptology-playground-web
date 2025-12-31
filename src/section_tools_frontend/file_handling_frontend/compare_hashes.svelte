<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import FileDropArea from '../../components/FileDropArea.svelte';
  
  import { compareFiles } from '../../section_tools_js/file_handling_js/compare_hashes.js';

  let file1 = null;
  let file2 = null;
  let result = null;
  let error = "";
  let isProcessing = false;

  function handleFile1(event) {
      if (event.detail && event.detail.length > 0) file1 = event.detail[0];
      result = null; // reset results on new file
  }

  function handleFile2(event) {
      if (event.detail && event.detail.length > 0) file2 = event.detail[0];
      result = null;
  }

  async function handleCompare() {
      if (!file1 || !file2) {
          error = "Please select both files.";
          return;
      }
      
      isProcessing = true;
      error = "";
      result = null;

      try {
          await new Promise(r => setTimeout(r, 50));
          result = await compareFiles(file1, file2);
      } catch (e) {
          error = e.message;
      } finally {
          isProcessing = false;
      }
  }

  const Links = [{text: "File verification - Wikipedia", url: "https://en.wikipedia.org/wiki/File_verification"}];
</script>

<ToolCard title="Compare File Hashes">
  
  <div class="comparison-grid">
      <div class="file-col">
          <FileDropArea label="Select File 1" on:change={handleFile1} />
          {#if file1}
            <div class="file-badge">📄 {file1.name}</div>
          {/if}
      </div>

      <div class="file-col">
          <FileDropArea label="Select File 2" on:change={handleFile2} />
          {#if file2}
            <div class="file-badge">📄 {file2.name}</div>
          {/if}
      </div>
  </div>

  <div class="button-row">
      <Button on:click={handleCompare} disabled={isProcessing || !file1 || !file2}>
          {#if isProcessing}Comparing...{:else}Compare Files{/if}
      </Button>
      <Button variant="secondary" on:click={() => { file1=null; file2=null; result=null; }}>Reset</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="results-area">
        
        <div class="verdict" class:match={result.isIdentical} class:mismatch={!result.isIdentical}>
            {result.isIdentical ? "FILES ARE IDENTICAL" : "FILES DIFFER"}
        </div>
        <div class="meta">Comparison Time: {result.timeTaken}s</div>

        <table class="hash-table">
            <thead>
                <tr>
                    <th>Algorithm</th>
                    <th>File 1 Hash</th>
                    <th>File 2 Hash</th>
                </tr>
            </thead>
            <tbody>
                <tr class:diff={result.file1.hashes.md5 !== result.file2.hashes.md5}>
                    <td>MD5</td>
                    <td class="hash-cell">{result.file1.hashes.md5}</td>
                    <td class="hash-cell">{result.file2.hashes.md5}</td>
                </tr>
                <tr class:diff={result.file1.hashes.sha1 !== result.file2.hashes.sha1}>
                    <td>SHA-1</td>
                    <td class="hash-cell">{result.file1.hashes.sha1}</td>
                    <td class="hash-cell">{result.file2.hashes.sha1}</td>
                </tr>
                <tr class:diff={result.file1.hashes.sha256 !== result.file2.hashes.sha256}>
                    <td>SHA-256</td>
                    <td class="hash-cell">{result.file1.hashes.sha256}</td>
                    <td class="hash-cell">{result.file2.hashes.sha256}</td>
                </tr>
            </tbody>
        </table>
    </div>
  {/if}

</ToolCard>

<Info title="About Hash Comparison" links={Links}>

  <p>
    <strong>File Hash Comparison</strong> is the most reliable way to verify if two files are identical 
        by computing and comparing their cryptographic hash values.
  </p>
  <p>
    Even if two files have the same name and size, their contents might differ (due to corruption, partial download, or tampering).
    Comparing their cryptographic hashes (like SHA-256) ensures bit-for-bit integrity.
  </p>

  <h3>Supported Algorithms:</h3>
        <ul>
          <li><b>MD5</b> – Fast checksum comparison</li>
          <li><b>SHA-1</b> – Common integrity verification hash</li>
          <li><b>SHA-256</b> – Modern secure standard for binary equality</li>
        </ul>
        <p>
        If all hashes match, the files are guaranteed to be identical.  
        This is useful for checking if backups, transfers, or downloads are unmodified.</p>


</Info>

<style>
  .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
  }

  .file-badge {
      text-align: center;
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #334155;
      background: #f1f5f9;
      padding: 0.4rem;
      border-radius: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }

  .button-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
  }

  .results-area {
      border-top: 1px solid #e2e8f0;
      padding-top: 1.5rem;
  }

  .verdict {
      text-align: center;
      font-weight: bold;
      font-size: 1.2rem;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
  }

  .verdict.match { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
  .verdict.mismatch { background: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; }

  .meta {
      text-align: center;
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 1.5rem;
  }

  .hash-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
  }

  .hash-table th, .hash-table td {
      border: 1px solid #cbd5e1;
      padding: 0.75rem;
      text-align: left;
  }

  .hash-table th { background: #f8fafc; color: #475569; }
  
  .hash-cell {
      font-family: monospace;
      word-break: break-all;
      color: #334155;
  }

  /* Highlight mismatched rows */
  tr.diff td { background: #fff1f2; }

  @media (max-width: 600px) {
      .comparison-grid { grid-template-columns: 1fr; }
      .hash-table { font-size: 0.75rem; }
      .hash-cell { word-break: break-word; }
  }
</style>