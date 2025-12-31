<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processUrlEncode } from '../../section_tools_js/encoders_js/url_encoder.js';

  let inputText = "";
  let mode = "encode"; // 'encode' or 'decode'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Text to URL Encoded" },
    { value: "decode", label: "URL Encoded to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processUrlEncode(inputText, mode);
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

<ToolCard title="URL Encoder / Decoder">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'encode' ? "Input Text:" : "Input URL Parameter:"}
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "e.g. C++ Programming" : "e.g. C%2B%2B+Programming"} 
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
    />
  {/if}

</ToolCard>

<Info title="About URL Encoding" links={[{text: "Percent-encoding -Wikipedia", url: "https://en.wikipedia.org/wiki/Percent-encoding"}]}>
  <p><b>URL encoding</b>, also known as percent encoding, is a method 
    used to encode special characters in a Uniform Resource Locator (URL) 
    so they can be safely transmitted over the Internet. URLs can only be 
    sent over the Internet using the ASCII character set. Since URLs often 
    contain characters outside the ASCII set, URL encoding is used to 
    convert them into a valid ASCII format. URL encoding replaces non-ASCII 
    characters or reserved characters with a '%' followed by two hexadecimal
    digits representing the character’s ASCII code. For example, a space 
    character, which is not allowed in a URL, is encoded as %20 or +. </p>
    <p><b>e.g.:</b> https://example.com/search?q=C++ programming <b>becomes:</b> 
    https://example.com/search?q=C%2B%2B%20programming</p>
</Info>