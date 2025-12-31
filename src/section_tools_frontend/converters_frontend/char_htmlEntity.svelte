<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processHtmlEntity } from '../../section_tools_js/converters_js/char_htmlEntity.js';

  let inputText = "";
  let mode = "char2entity"; // 'char2entity' or 'entity2char'
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "char2entity", label: "Text to HTML Entities" },
    { value: "entity2char", label: "HTML Entities to Text" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processHtmlEntity(inputText, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'char2entity') ? 'entity2char' : 'char2entity';
      
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode)) {
      runConverter();
  }
</script>

<ToolCard title="HTML Entity Converter">
  
  <div class="controls-row">
    <Select 
      label="Conversion Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <Input 
    label={mode === 'char2entity' ? "Input Text:" : "Input HTML Entities:"}
    bind:value={inputText} 
    placeholder={mode === 'char2entity' ? "Type <script> or special chars..." : "e.g. &lt;h1&gt;Hello&lt;/h1&gt;"} 
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
      label={mode === 'char2entity' ? "HTML Safe Output:" : "Decoded Text:"}
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About HTML Entities" links={[{ text: "Wikipedia", 
url: "https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references" }]}>
  <p>
    <strong>HTML Entities</strong> are used to display reserved characters in HTML.
  </p>

  <p>
    For example, if you write <code>&lt;</code> in your HTML code, the browser thinks you are starting a tag. 
    To display the actual "less than" symbol, you must write <code>&amp;lt;</code> or <code>&amp;#60;</code>.
  </p>
  <p>
    <strong>Common Entities:</strong>
  </p>
  <ul>
    <li><code>&amp;lt;</code> = &lt;</li>
    <li><code>&amp;gt;</code> = &gt;</li>
    <li><code>&amp;amp;</code> = &amp;</li>
    <li><code>&amp;quot;</code> = "</li>
    <li><code>&amp;copy;</code> = ©</li>
  </ul>
  <p>
    This tool also converts non-ASCII characters (like emojis or foreign letters) into their numeric decimal codes 
    to ensure they display correctly on all browsers.
  </p>
</Info>