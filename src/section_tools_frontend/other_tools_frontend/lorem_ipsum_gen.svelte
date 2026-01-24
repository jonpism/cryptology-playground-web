<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import Input from '../../components/Input.svelte';

  import { generateLoremIpsum } from '../../section_tools_js/other_tools_js/lorem_ipsum_gen.js';

  let charLimit = 500; // default value
  let result = "";
  let error = "";

  function handleGenerate() {
      if (charLimit <= 0) {
          error = "Please enter a valid number of characters.";
          result = "";
          return;
      }

      error = "";
      try {
          result = generateLoremIpsum(charLimit);
          if (!result) {
            error = "Length too short to fit any words.";
          }
      } catch (e) {
          error = e.message;
      }
  }

  const links = [
      { text: "Lorem Ipsum - Wikipedia", url: "https://en.wikipedia.org/wiki/Lorem_ipsum" }
  ];
</script>

<ToolCard title="Lorem Ipsum Generator">
    
    <div class="controls">
        <div class="input-wrapper">
            <label for="char-limit">How many characters:</label>
            <input 
                id="char-limit"
                type="number" 
                bind:value={charLimit} 
                min="1" 
                class="number-input"
            />
        </div>

        <Button on:click={handleGenerate}>Generate</Button>
    </div>

    {#if error}
        <div class="msg error">{error}</div>
    {/if}

    {#if result}
    <div class="result-section">
      <div class="result-box">
        <Input 
            value={result} 
            readonly={true} 
            expandable={true}
            withCopy={true}
            />
      </div>
    </div>
    {/if}

</ToolCard>

<Info title="About Lorem Ipsum" links={links}>
    <p>
        <b>Lorem Ipsum</b> is dummy text used in laying out print, graphic or web designs. 
        The passage is attributed to an unknown typesetter in the 15th century who is thought 
        to have scrambled parts of Cicero's <i>De Finibus Bonorum et Malorum</i> for use in a type specimen book.
    </p>
    <p>
        This tool generates random sentences using the standard Latin vocabulary, ensuring the text fits within your specified character limit.
    </p>
</Info>

<style>
    .controls {
        display: flex;
        align-items: flex-end;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-weight: bold;
        color: #334155;
        font-size: 0.95rem;
    }

    .number-input {
        padding: 0.8rem;
        border: 2px solid #cbd5e1;
        border-radius: 6px;
        width: 150px;
        font-size: 1rem;
    }

    .number-input:focus {
        outline: none;
        border-color: #3b82f6;
    }

    .msg.error {
        margin-top: 1rem;
        padding: 1rem;
        background: #fee2e2;
        color: #dc2626;
        border-radius: 6px;
    }
</style>