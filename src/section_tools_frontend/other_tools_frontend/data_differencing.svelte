<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { DataDifferencing } from '../../section_tools_js/other_tools_js/data_differencing.js';

  let sourceInput = "";
  let targetInput = "";
  
  let deltaOutput = "";
  let reconstructedOutput = "";
  let error = "";
  let autoUpdate = true;

  function handleDiff() {
      error = "";
      deltaOutput = "";
      reconstructedOutput = "";

      if (!sourceInput) return error = "Please enter source text.";
      if (!targetInput) return error = "Please enter target text.";

      try {
          const differ = new DataDifferencing();
          
          // 1. Create Delta
          const delta = differ.createDelta(sourceInput, targetInput);
          
          // format delta for display
          deltaOutput = JSON.stringify(delta, null, 2);

          // reconstruct to verify
          reconstructedOutput = differ.applyDelta(sourceInput, delta);

          if (reconstructedOutput !== targetInput) {
              throw new Error("Integrity Check Failed: Reconstructed string does not match target.");
          }

      } catch (e) {
          error = e.message;
      }
  }

  $: if (autoUpdate && (sourceInput) && targetInput) {
      handleDiff();}

  const dataDiffLinks = [{text: "Data differencing - Wikipedia", url: "https://en.wikipedia.org/wiki/Data_differencing"}];

</script>

<ToolCard title="Data Differencing">
  
  <div class="inputs-grid">
      <div class="input-item">
        <Input 
            label="Source Sequence:" 
            bind:value={sourceInput} 
            placeholder="Original text..." 
            rows={3}
        />
      </div>
      <div class="input-item">
        <Input 
            label="Target Sequence:" 
            bind:value={targetInput} 
            placeholder="Modified text..." 
            rows={3}
        />
      </div>
  </div>

  <div class="button-row">
    <Button on:click={handleDiff}>Generate Delta & Reconstruct</Button>
    <Button variant="secondary" on:click={() => { 
        sourceInput=""; targetInput=""; deltaOutput=""; reconstructedOutput=""; 
    }}>Clear</Button>

    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if deltaOutput}
    <div class="results-area">
        
        <Input 
            label="Generated Delta (Operations):" 
            value={deltaOutput} 
            readonly={true} 
            expandable={true} 
            rows={6}
            font="monospace"
        />

        <div class="reconstruction-box">
            <Input 
                label="Reconstructed from Source + Delta:" 
                value={reconstructedOutput} 
                readonly={true} 
            />
            {#if reconstructedOutput === targetInput}
                <div class="success-badge">Verified Match</div>
            {/if}
        </div>

    </div>
  {/if}

</ToolCard>

<Info title="About Data Differencing" links={dataDiffLinks}>

    <p><strong>Data Differencing</strong> (or Delta Encoding) calculates the difference between two files or strings. 
    Instead of saving both versions fully, you save the <strong>Source</strong> and a small <strong>Delta</strong> file.</p>

    <p>This tool demonstrates the concept of data differencing,
    which involves computing the differences (delta) between two data sequences
    and using these differences to reconstruct the modified sequence.</p>
    <b>Key Features:</b>
    <ul>
    <li>Generate a delta between a source and a target sequence.</li>
    <li>Reconstruct the target sequence from the source using the delta.</li>
    <li>The underlying logic relies on comparing byte sequences to detect matching, 
    added, or deleted segments, enabling efficient data transformations.</li>
    </ul>
  
  <p><strong>Operations:</strong></p>
  <ul>
    <li><strong>COPY:</strong> Read specific bytes from the Source (saves space).</li>
    <li><strong>ADD:</strong> Insert new bytes that don't exist in Source.</li>
    <li><strong>DELETE:</strong> Skip bytes present in Source.</li>
  </ul>
  <p>
    This technique is heavily used in software updates (patches), version control systems (Git), and data synchronization to save bandwidth.
  </p>
</Info>

<style>
  .inputs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
  }

  .reconstruction-box {
      position: relative;
  }

  .success-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #f0fdf4;
      color: #15803d;
      font-size: 0.8rem;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      border: 1px solid #86efac;
      font-weight: bold;
  }

  @media (max-width: 600px) {
      .inputs-grid { grid-template-columns: 1fr; }
  }
</style>