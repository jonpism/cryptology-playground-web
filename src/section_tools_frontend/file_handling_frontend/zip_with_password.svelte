<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import Select from '../../components/Select.svelte';
  import FileDropArea from '../../components/FileDropArea.svelte';
  
  import { createEncryptedZip } from '../../section_tools_js/file_handling_js/zip_with_password.js';

  let selectionMode = "files"; // 'files' or 'folder'
  let selectedFiles = null;
  let password = "";
  
  let isProcessing = false;
  let error = "";
  let successMessage = "";

  const modeOptions = [
    { value: "files", label: "Select Files" },
    { value: "folder", label: "Select Folder" }
  ];

  // FileDropArea component
  function handleFilesChanged(event) {
      const files = event.detail;
      if (files && files.length > 0) {
          selectedFiles = files;
          error = "";
          successMessage = "";
      }
  }

  async function handleZip() {
      error = "";
      successMessage = "";

      if (!selectedFiles || selectedFiles.length === 0) {
          error = "Please select files or a folder first.";
          return;
      }
      if (!password) {
          error = "Please enter a password.";
          return;
      }

      isProcessing = true;

      try {
          const blob = await createEncryptedZip(selectedFiles, password);
          
          // download
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          let baseName = "encrypted_archive";
          if (selectedFiles.length > 0 && selectedFiles[0].name) {
              baseName = selectedFiles[0].name.split('.')[0];
          }
          
          link.download = `${baseName}_encrypted.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          successMessage = "ZIP file created and downloaded successfully.";
          
          password = "";
          selectedFiles = null;

      } catch (e) {
          error = e.message;
      } finally {
          isProcessing = false;
      }
  }

  const zipWithPwdLinks = [{text: "ZIP (file format) - Wikipedia", url: "https://en.wikipedia.org/wiki/ZIP_(file_format)"}, 
  {text: "ZIP (file format) - Wikiwand", url: "https://www.wikiwand.com/en/articles/ZIP_(file_format)"},
  {text: "NPM package", url: "https://www.npmjs.com/package/@zip.js/zip.js/v/2.6.40"}
];

</script>

<ToolCard title="Zip with Password">

  <div class="drop-area-container">
      {#if selectionMode === 'folder'}
          <FileDropArea 
              directory={true} 
              label="Select Folder to Zip" 
              on:change={handleFilesChanged} 
          />
      {:else}
          <FileDropArea 
              multiple={true} 
              label="Select Files to Zip" 
              on:change={handleFilesChanged} 
          />
      {/if}
  </div>

  {#if selectedFiles}
      <div class="file-status">
          ✅ <strong>{selectedFiles.length}</strong> item(s) ready to zip
      </div>
  {/if}

  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={selectionMode} 
      options={modeOptions} 
    />
    <Input 
    label="Set Password:" 
    bind:value={password} 
    placeholder="Enter strong password..." 
    type="password"
  />
  </div>

  <div class="button-row" style="margin: auto;">
    <Button on:click={handleZip} disabled={isProcessing}>
        {#if isProcessing}Compressing & Encrypting...{:else}Download Encrypted ZIP{/if}
    </Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if successMessage}
    <div class="msg success">{successMessage}</div>
  {/if}

</ToolCard>

<Info title="About Secure Zip" links={zipWithPwdLinks}>
  <p>
    This tool allows you to create <strong>AES-256 Encrypted ZIP files</strong> directly in your browser.
  </p>
  
  <ul>
    <li>Select a file and bundle it into an archive.</li>
    <li>Select a folder to preserve the directory structure inside the ZIP.</li>
    <li>Uses AES-256 encryption.</li>
  </ul>

  <p>
    <em><b>Note:</b> NO FILES OR FOLDERS are sent to any server. Uploading happens only in your browser.</em>
  </p>
</Info>

<style>

  .file-status {
      text-align: center;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
      color: #15803d;
      background: #f0fdf4;
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid #86efac;
  }

  .msg.success {
      color: #15803d;
      background: #f0fdf4;
      border: 1px solid #86efac;
      padding: 0.8rem;
      border-radius: 6px;
      margin-top: 1rem;
  }
</style>