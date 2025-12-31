<script>
  import { createEventDispatcher } from 'svelte';
  
  export let accept = "*";          // ".png,.jpg" or "image/*"
  export let multiple = false;      // allow multiple file selection
  export let directory = false;     // directory mode (webkitdirectory)
  export let label = "Drop file here or click to upload";

  const dispatch = createEventDispatcher();
  let fileInput;
  let isDragging = false;

  // drag & drop

  function onDragOver(e) {
    e.preventDefault();
    isDragging = true;
  }

  function onDragLeave() {
    isDragging = false;
  }

  function onDrop(e) {
    e.preventDefault();
    isDragging = false;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  // click & input

  function onClick() {
    fileInput.click();
  }

  function onFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }

  // common file processor
  
  function handleFiles(fileList) {
    // dispatch the native FileList object to the parent
    dispatch('change', fileList);
  }
</script>

<div 
  class="drop-zone" 
  class:active={isDragging}
  on:dragover={onDragOver} 
  on:dragleave={onDragLeave} 
  on:drop={onDrop}
  on:click={onClick}
  on:keydown={(e) => e.key === 'Enter' && onClick()}
  role="button"
  tabindex="0"
>
  {#if directory}
    <input 
      bind:this={fileInput}
      type="file" 
      webkitdirectory 
      directory
      style="display: none;" 
      on:change={onFileChange}
    />
  {:else}
    <input 
      bind:this={fileInput}
      type="file" 
      {accept}
      {multiple}
      style="display: none;" 
      on:change={onFileChange}
    />
  {/if}

  <div class="content">
    <div class="icon">
      {#if directory}
        📂 {:else}
        📄 {/if}
    </div>
    <div class="text">
      <strong>{label}</strong>
      <span class="subtext">
        {directory ? "(Drag a folder here)" : "(or drag files here)"}
      </span>
    </div>
  </div>
</div>

<style>
  .drop-zone {
    border: 2px dashed #cbd5e1;
    border-radius: 8px;
    background: #f8fafc;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    margin-bottom: 1rem;
    user-select: none;
  }

  .drop-zone:hover {
    border-color: #94a3b8;
    background: #f1f5f9;
  }

  .drop-zone.active {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: scale(1.01);
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    pointer-events: none;
  }

  .icon {
    font-size: 2rem;
    opacity: 0.7;
  }

  .text {
    color: #334155;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
  }

  .subtext {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: normal;
  }
</style>