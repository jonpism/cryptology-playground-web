<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Info from '../../components/Info.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  
  import { generateQRCode } from '../../section_tools_js/other_tools_js/qr_code_gen.js';

  let inputText = "";
  let generatedImgSrc = "";
  let error = "";
  let isGenerating = false;

  // options
  let errorCorrectionLevel = 'M';
  let moduleSize = 5;
  let margin = 4;

  const ecOptions = [
    { value: 'L', label: 'Low (7%)' },
    { value: 'M', label: 'Medium (15%)' },
    { value: 'Q', label: 'Quartile (25%)' },
    { value: 'H', label: 'High (30%)' }
  ];
  
  const sizeOptions = [
    { value: 2, label: '2px (Tiny)' },
    { value: 5, label: '5px (Medium)' },
    { value: 10, label: '10px (Large)' },
    { value: 20, label: '20px (Huge)' }
  ];

  const marginOptions = [
    { value: 0, label: 'None (0 blocks)' },
    { value: 1, label: 'Thin (1 block)' },
    { value: 4, label: 'Standard (4 blocks)' }
  ];

  $: if (inputText || errorCorrectionLevel || moduleSize || margin) {
      handleGenerate();
  }

  async function handleGenerate() {
      if (!inputText) {
          generatedImgSrc = "";
          return;
      }
      
      isGenerating = true;
      error = "";
      
      try {
          generatedImgSrc = await generateQRCode(inputText, {
              errorCorrectionLevel,
              scale: moduleSize,
              margin
          });
      } catch (e) {
          error = e.message;
      } finally {
          isGenerating = false;
      }
  }

  function downloadQRCode() {
      if (!generatedImgSrc) return;
      
      const a = document.createElement('a');
      a.href = generatedImgSrc;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }

  const qrLinks = [
      { text: "QR Code - Wikipedia", url: "https://en.wikipedia.org/wiki/QR_code" }
  ];
</script>

<ToolCard title="QR Code Generator">
    
    <div class="controls-grid">
        <Select 
            id="ec-level"
            label="Error Correction:" 
            bind:value={errorCorrectionLevel} 
            options={ecOptions} 
        />
        
        <Select 
            id="mod-size"
            label="Module Size:" 
            bind:value={moduleSize} 
            options={sizeOptions} 
        />
        
        <Select 
            id="margin-size"
            label="Margin (Border):" 
            bind:value={margin} 
            options={marginOptions} 
        />
    </div>

    <div class="input-area">
        <label for="qr-input">Input Text / URL:</label>
        <textarea 
            id="qr-input"
            bind:value={inputText} 
            placeholder="Type text or URL here to generate QR..."
            rows="4"
        ></textarea>
    </div>

    {#if error}
        <div class="msg error">{error}</div>
    {/if}

    {#if generatedImgSrc}
        <div class="output-area">
            <div class="qr-preview">
                <img src={generatedImgSrc} alt="Generated QR Code" />
            </div>
            
            <div class="action-row">
                <Button on:click={downloadQRCode}>Download PNG image</Button>
            </div>
        </div>
    {/if}

</ToolCard>

<Info title="About QR Codes" links={qrLinks}>

    <p>This tool allows you to create QR codes from any text input. You can customize various parameters, including:</p>

    <ul>
        <li><strong>Error Correction:</strong> Allows the QR code to be scanned even if part of it is damaged or covered. 'High' allows up to 30% damage but makes the code denser.</li>
        <li><strong>Module Size:</strong> The pixel size of each black/white square (dot).</li>
    </ul>

    <p>The generated QR code will be displayed within the application. You have the option to download the 
        .png file image that will be generated.</p>
    <p>Simply enter your text, adjust the settings as needed, and the tool will generate your (static) QR code!</p>
    
</Info>

<style>
    .controls-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .input-area {
        margin-bottom: 1.5rem;
    }
    
    label {
        font-weight: bold;
        display: block;
        margin-bottom: 0.5rem;
        color: #334155;
    }

    textarea {
        width: 100%;
        padding: 0.8rem;
        border: 2px solid #cbd5e1;
        border-radius: 6px;
        background: #fff;
        font-family: monospace;
        resize: vertical;
        box-sizing: border-box;
    }
    
    textarea:focus {
        outline: none;
        border-color: #3b82f6;
    }

    .output-area {
        margin-top: 1rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .qr-preview {
        padding: 1rem;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        display: inline-block;
    }

    img {
        max-width: 100%;
        height: auto;
        display: block;
    }
</style>