<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processCodepoint } from '../../section_tools_js/converters_js/codepoint_converter.js';

  let inputText = "";
  let mode = "char2cp"; // 'char2cp' or 'cp2char'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "char2cp", label: "Text to Codepoint (U+XXXX)" },
    { value: "cp2char", label: "Codepoint to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processCodepoint(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'char2cp') ? 'cp2char' : 'char2cp';
      
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }
</script>

<ToolCard title="Unicode Codepoint Converter">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'char2cp' ? "Input Text:" : "Input Codepoints:"}
    bind:value={inputText} 
    placeholder={mode === 'char2cp' ? "Type text or emojis..." : "e.g. U+0048 U+0069"} 
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
      label={mode === 'char2cp' ? "Codepoint Output:" : "Text Output:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Unicode Codepoints" 
links={[{ text: "Unicode Characters - Wikipedia", 
url: "https://en.wikipedia.org/wiki/List_of_Unicode_characters" }]}>
  <p>
    <strong>Unicode</strong> is the universal standard for representing text. It assigns a unique number, called a <strong>Codepoint</strong>, to every character in almost every language (including emojis!).
  </p>

  <p>
    The standard format for writing these is <code>U+</code> followed by the hexadecimal number.
  </p>
  <ul>
    <li><strong>A</strong> = <code>U+0041</code></li>
    <li><strong>€</strong> = <code>U+20AC</code></li>
  </ul>
  <p>
    Unlike older encodings (like ASCII) which were limited to 128 characters, Unicode supports over 149,000 characters, organized into "Planes" and "Blocks".
  </p>
</Info>