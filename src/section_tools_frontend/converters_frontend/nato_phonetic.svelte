<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processNato } from '../../section_tools_js/converters_js/nato_phonetic.js';

  let inputText = "";
  let mode = "text2nato"; // 'text2nato' or 'nato2text'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "text2nato", label: "Text to NATO" },
    { value: "nato2text", label: "NATO to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processNato(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'text2nato') ? 'nato2text' : 'text2nato';
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }
</script>

<ToolCard title="NATO Phonetic Converter">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'text2nato' ? "Input Text:" : "Input NATO Code:"}
    bind:value={inputText} 
    placeholder={mode === 'text2nato' ? "Type text..." : "e.g. Alfa Bravo Charlie"} 
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
      label={mode === 'text2nato' ? "NATO Output:" : "Text Output:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About NATO Phonetic Alphabet" links={[{ text: "NATO Phonetic Alphabet - Wikipedia", url: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet" }]}>
  <p>
    The <strong>NATO Phonetic Alphabet</strong> (officially the International Radiotelephony Spelling Alphabet) assigns a code word to each letter of the alphabet.
  </p>
  
  <p>
    It is designed to prevent confusion during voice communication, where letters like 'B', 'D', 'P', and 'T' can sound identical over noisy radio channels.
  </p>
  <ul>
    <li><strong>A</strong> to Alfa</li>
    <li><strong>B</strong> to Bravo</li>
    <li><strong>C</strong> to Charlie</li>
  </ul>
  <p>
    This tool uses the official ICAO standard spellings (note "Alfa" with an 'f' and "Juliett" with two 't's), which ensure consistent pronunciation across different native languages.
  </p>
</Info>