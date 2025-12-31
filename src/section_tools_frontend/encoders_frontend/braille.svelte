<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processBraille } from '../../section_tools_js/encoders_js/braille.js';

  let inputText = "";
  let mode = "text2braille"; // 'text2braille' or 'braille2text'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "text2braille", label: "Text to Braille" },
    { value: "braille2text", label: "Braille to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processBraille(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'text2braille') ? 'braille2text' : 'text2braille';
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }

  const brailleLinks = [
    { text: "Braille - Wikipedia", url: "https://en.wikipedia.org/wiki/Braille" },
    { text: "Britannica", url: "https://www.britannica.com/topic/Braille-writing-system" }
  ];
</script>

<ToolCard title="Braille Tactile Writing System Encoder/Decoder">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'text2braille' ? "Input Text:" : "Input Braille:"}
    bind:value={inputText} 
    placeholder={mode === 'text2braille' ? "e.g. Hello World" : "e.g. ⠓⠑⠇⠇⠕"} 
    expandable={true}
  />

  <div class="button-row">
    <Button on:click={runConverter}>Translate</Button>
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
      rows={4}
    />
  {/if}

</ToolCard>

<Info title="About Braille" links={brailleLinks}>
  <p><b>Braille</b> is a tactile writing system used by individuals who are 
    visually impaired or blind. It was invented by Louis Braille, 
    a French educator who lost his sight due to a childhood accident. </p>

    <p>He developed this system in the early 19th century to make reading 
    and writing more accessible for people who cannot use traditional print. 
    The fundamental component of Braille is the 'Braille cell', which 
    is made up of six raised dots arranged in two parallel columns of 
    three dots each. These dots are numbered from 1 to 6, with dot 1 
    at the top left and dot 6 at the bottom right. Different combinations 
    of these dots represent different letters, numbers, punctuation marks, 
    and even entire words or phrases. There are 64 possible combinations 
    of the six dots, including a configuration with no dots raised. These 
    combinations are used to encode letters, numbers, and other symbols. 
    For example, the letter 'A' is represented by a single raised dot
    in position 1, while 'B' has raised dots in positions 1 and 2.</p>


</Info>