<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processMorse } from '../../section_tools_js/encoders_js/morse_code.js';

  let inputText = "";
  let mode = "text2morse"; // 'text2morse' or 'morse2text'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "text2morse", label: "Text to Morse Code" },
    { value: "morse2text", label: "Morse Code to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processMorse(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'text2morse') ? 'morse2text' : 'text2morse';
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }

  const morseLinks = [
    { text: "Morse Code - Wikipedia", url: "https://en.wikipedia.org/wiki/Morse_code" },
  ];
</script>

<ToolCard title="Morse Code Encoder/Decoder">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'text2morse' ? "Input Text:" : "Input Morse:"}
    bind:value={inputText} 
    placeholder={mode === 'text2morse' ? "e.g. SOS" : "e.g. ... --- ..."} 
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
      label={mode === 'text2morse' ? "Morse Output:" : "Text Output:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Morse Code" links={morseLinks}>

  <p><b>Morse code</b> is a method of transmitting text information using 
    a series of on-off signals, which can be in the form of sound, 
    light, or visual signals. It encodes the characters of the alphabet, 
    numerals, and punctuation marks as sequences of dots (.) and  
    dashes (−). Morse code was developed in the early 1830s and 
    1840s by Samuel Morse and Alfred Vail, primarily for use in telegraphy.</p>
    Each letter or number is represented by a unique sequence of dots and dashes. 
    A dot is a short signal, while a dash is a longer one, typically three times 
    the duration of a dot. <br> 
    <b>e.g:</b> S= ..., O= ---, so the word SOS becomes: ...---...
</Info>