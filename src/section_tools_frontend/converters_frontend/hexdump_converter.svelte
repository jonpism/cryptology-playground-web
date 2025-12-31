<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';

  import { processHexdump } from '../../section_tools_js/converters_js/hexdump_converter.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let inputEncoding = "utf-8";
  let width = 16;
  
  let result = "";
  let error = "";
  let autoUpdate = true;
  let fileInput; // file input reference

  // width options
  const widthOptions = [
    { value: 8, label: "8 Bytes per line" },
    { value: 16, label: "16 Bytes per line" },
    { value: 32, label: "32 Bytes per line" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processHexdump(inputText, width, inputEncoding);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  // handle file upload
  function handleFile(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          // pass raw ArrayBuffer to the processor
          const arrayBuffer = event.target.result;
          const bytes = new Uint8Array(arrayBuffer);
          
          try {
             // pass the bytes directly
             result = processHexdump(bytes, width);
             inputText = `[Binary File Loaded: ${file.name} (${file.size} bytes)]`;
          } catch (err) {
             error = err.message;
          }
      };
      reader.readAsArrayBuffer(file);
  }

  $: if (autoUpdate && (inputText && !inputText.startsWith('[Binary')) && (inputEncoding || width)) {
      runConverter();
  }
</script>

<ToolCard title="Hexdump Generator">
  
  <div class="controls-row">
    <Select 
      label="Input Encoding:" 
      bind:value={inputEncoding} 
      options={ENCODING_OPTIONS.map(o => o.value)} 
    />
    
    <Select 
      label="Width:" 
      bind:value={width} 
      options={widthOptions} 
    />
  </div>

  <Input 
    label="Input Data:" 
    bind:value={inputText} 
    placeholder="Type text here..." 
    expandable={true}
  />
  
  <div style="margin-top: 0.5rem; margin-bottom: 1rem;">
      <label style="font-size: 0.9rem; font-weight: 500; color: #334155;">Or upload a binary file:</label>
      <input 
        type="file" 
        bind:this={fileInput} 
        on:change={handleFile} 
        style="margin-top: 0.3rem;" 
      />
  </div>

  <div class="button-row">
    <Button on:click={runConverter}>Generate Dump</Button>
    <Button variant="secondary" on:click={() => { 
        inputText = ""; 
        result = ""; 
        if(fileInput) fileInput.value = ""; 
    }}>Clear</Button>
    
    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <Input 
      label="Hexdump Output:" 
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true}
      rows={10}
      monospace={true} 
    />
  {/if}

</ToolCard>

<Info title="About Hexdumps" links={[{ text: "Hexdump - Wikipedia", url: "https://en.wikipedia.org/wiki/Hexdump" }]}>
  <p>
    A <strong>Hexdump</strong> provides a view of data that is useful for debugging and reverse engineering.
  </p>
  
  <p>It consists of three columns:</p>
  <ol>
    <li><strong>Offset:</strong> The memory address or file position (in Hex).</li>
    <li><strong>Hex:</strong> The actual byte values.</li>
    <li><strong>ASCII:</strong> The text representation. Non-printable characters (like null bytes or newlines) are replaced with a dot (<code>.</code>).</li>
  </ol>
  <p>
    This format allows you to see the structure of binary files (like PNG headers) or find hidden strings inside compiled programs.
  </p>
</Info>