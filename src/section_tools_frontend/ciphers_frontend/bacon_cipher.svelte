<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import SwapButton from '../../components/SwapButton.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { encodeBacon, decodeBacon } from '../../section_tools_js/ciphers_js/bacon_cipher.js';

  let mode = "encode"; // 'encode' or 'decode'
  let inputText = "";
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Encode (Text -> Bacon)" },
    { value: "decode", label: "Decode (Bacon -> Text)" }
  ];

  function handleProcess() {
      error = "";
      result = "";

      if (!inputText) return error = "Please enter text.";

      try {
          if (mode === 'encode') {
              result = encodeBacon(inputText);
          } else {
              result = decodeBacon(inputText);
          }
      } catch (e) {
          error = e.message;
      }
  }

  function toggleMode() {
      mode = (mode === 'encode') ? 'decode' : 'encode';
      if (result && !error) {
          inputText = result;
          result = "";
      }
  }

  $: if (autoUpdate && (inputText)) {
      handleProcess();}

  const baconLinks=[{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bacon's_cipher"},
    {text: "Practical Cryptography", url: "http://www.practicalcryptography.com/ciphers/baconian-cipher"},
  ];
</script>

<ToolCard title="Bacon Cipher">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'encode' ? "Plaintext:" : "Bacon Ciphertext (A/B):"} 
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "Secret message..." : "aaaaa baaab..."} 
    expandable={true} 
    rows={3}
  />

  <div class="button-row">
    <Button on:click={handleProcess}>
        {mode === 'encode' ? 'Encode' : 'Decode'}
    </Button>
    <Button variant="secondary" on:click={() => { inputText=""; result=""; }}>Clear</Button>
    <SwapButton on:click={toggleMode} />

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

<Info title="About Bacon Cipher" links={baconLinks}>
  <p>The Bacon cipher, also known as Bacon's cipher, is a steganographic 
    method developed by Sir Francis Bacon in the early 17th century. 
    It encodes messages through binary coding, where text is concealed by 
    using two distinct typefaces or styles of text (for example, bold and regular). </p>
    <p>This cipher falls under the category of steganography because the encoded 
    message is hidden within the text’s format rather than in the content itself. 
    Each letter in the English alphabet is represented by a sequence of five 
    binary characters (A or B). Bacon originally mapped out 24 letters
    (I and J, as well as U and V, were each treated as a single letter).
    For example: <b>A=AAAAA, B=AAAAB, C=AAABA, D=AAABB </b> etc </p>

</Info>

<style>
  .controls-row {
    margin-bottom: 1rem;
    max-width: 300px;
  }
</style>