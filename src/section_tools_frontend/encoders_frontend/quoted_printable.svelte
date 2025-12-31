<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processQuotedPrintable } from '../../section_tools_js/encoders_js/quoted_printable.js';

  let inputText = "";
  let mode = "encode"; // 'encode' or 'decode'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Text to Quoted-Printable" },
    { value: "decode", label: "Quoted-Printable to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processQuotedPrintable(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'encode') ? 'decode' : 'encode';
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }
</script>

<ToolCard title="Quoted-Printable Encoding">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'encode' ? "Input Text:" : "Input Encoded Data:"}
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "e.g. München" : "e.g. M=C3=BCnchen"} 
    expandable={true}
  />

  <div class="button-row">
    <Button on:click={runConverter}>Convert</Button>
    <Button variant="secondary" on:click={() => { inputText = ""; result = ""; }}>Clear</Button>
    <SwapButton on:click={swapModes} />
    
    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <Input 
      label="Result:" 
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
      monospace={true}
    />
  {/if}

</ToolCard>

<Info title="About Quoted-Printable" links={[{ text: "QP - Wikipedia", url: "https://en.wikipedia.org/wiki/Quoted-printable" }]}>
  <p>
    <strong>Quoted-Printable</strong> (QP) is an encoding used for email (MIME) to ensure safe delivery of text.
  </p>
  
  <p>
    Legacy email systems often only support 7-bit ASCII characters (English letters/numbers). 
    If you try to send special characters (like <code>=</code>, <code>ü</code>, or emojis), they might break the system.
  </p>
  <p>
    <strong>How it works:</strong>
  </p>
  <ul>
    <li>Standard characters (<code>A-Z</code>) are left alone.</li>
    <li>Special characters are converted to <code>=</code> followed by their Hex code.
      <br>Example: <code>=</code> becomes <code>=3D</code>.</li>
    <li>Lines are limited to 76 characters. Long lines are "soft wrapped" by adding an <code>=</code> at the end of the line.</li>
  </ul>
</Info>