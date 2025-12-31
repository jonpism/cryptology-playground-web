<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import FileDropArea from '../../components/FileDropArea.svelte';
  
  import { csvToJson, jsonToCsv } from '../../section_tools_js/converters_js/csv_json.js';

  let mode = "csv2json"; // 'csv2json' or 'json2csv'
  let inputText = "";
  let resultOutput = "";
  let error = "";
  let fileName = ""; // download naming

  const modeOptions = [
    { value: "csv2json", label: "CSV to JSON" },
    { value: "json2csv", label: "JSON to CSV" }
  ];

  // handle file uploads
  function handleFile(event) {
      const file = event.detail[0]; // get first file
      if (!file) return;

      fileName = file.name.split('.')[0]; // keep filename for download
      
      const reader = new FileReader();
      reader.onload = (e) => {
          inputText = e.target.result;
          // auto switch mode based on file extension
          if (file.name.toLowerCase().endsWith('.json')) {
              mode = "json2csv";
          } else if (file.name.toLowerCase().endsWith('.csv')) {
              mode = "csv2json";
          }
          handleConvert(); // auto convert on upload
      };
      reader.readAsText(file);
  }

  async function handleConvert() {
      error = "";
      resultOutput = "";

      if (!inputText.trim()) {
          error = "Please enter text or upload a file.";
          return;
      }

      try {
          if (mode === 'csv2json') {
              resultOutput = await csvToJson(inputText);
          } else {
              resultOutput = jsonToCsv(inputText);
          }
      } catch (e) {
          error = e.message;
      }
  }

  function downloadResult() {
      if (!resultOutput) return;
      
      const ext = mode === 'csv2json' ? 'json' : 'csv';
      const blob = new Blob([resultOutput], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `${fileName || 'converted_data'}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  }

  const csvjsonLinks = [{text: "CSV - Wikipedia", url: "https://en.wikipedia.org/wiki/Comma-separated_values"},
    {text: "JSON - Wikipedia", url: "https://en.wikipedia.org/wiki/JSON"}
  ];
</script>

<ToolCard title="CSV / JSON Converter">
  
  <div class="controls-row">
    <Select 
      label="Conversion Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
  </div>

  <div class="drop-container">
      <FileDropArea 
          accept={mode === 'csv2json' ? ".csv" : ".json"}
          label={`Upload ${mode === 'csv2json' ? 'CSV' : 'JSON'} File`}
          on:change={handleFile}
      />
  </div>

  <Input 
    label={mode === 'csv2json' ? "Input CSV Data:" : "Input JSON Data:"} 
    bind:value={inputText} 
    placeholder="Paste data here..." 
    expandable={true} 
    rows={6}
  />

  <div class="button-row">
    <Button on:click={handleConvert}>Convert</Button>
    <Button variant="secondary" on:click={() => { inputText=""; resultOutput=""; fileName=""; }}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if resultOutput}
    <div class="result-section">
        <Input 
            label="Result:" 
            value={resultOutput} 
            readonly={true} 
            expandable={true} 
            withCopy={true}
            rows={6}
        />
        
        <div class="download-btn-container" style="display: flex; margin: auto; justify-content: center;">
            <Button on:click={downloadResult} variant="secondary">
                Download as File
            </Button>
        </div>
    </div>
  {/if}

</ToolCard>

<Info title="About CSV and JSON" links={csvjsonLinks}>
  <p><b>CSV (Comma-Separated Values)</b> and <b>JSON (JavaScript Object Notation)</b> 
    are two common file formats used for data storage and transfer.
    </p>

    <p><b>CSV</b> is a simple text-based file format used to represent 
    tabular data (data arranged in rows and columns). Each line in a CSV 
    file corresponds to a data record, with fields (or columns) separated 
    by commas. For example:</p>
    <pre>Name,    Age, Country<br>
    John Doe, 30, USA<br>
    Jane Smith, 25, Canada</pre><br>

    <p><b>JSON</b> is a text-based file format that represents structured data 
    in a readable form. It uses key-value pairs and supports nested data 
    structures. It is often used for data interchange, especially in 
    web applications. Example:</p>
    <pre>
        "name": "John Doe",<br>
        "age": 30,<br>
        "address": <br>
            "city": "New York",<br>
            "country": "USA",<br>
        "hobbies": ["reading", "traveling", "coding"]<br><br></pre>
  
  <ul>
    <li><strong>CSV to JSON:</strong> Converts rows into an array of objects. First row is treated as headers (keys).</li>
    <li><strong>JSON to CSV:</strong> Flattens an array of objects back into rows. Keys become headers.</li>
  </ul>

  <p>
    <em><b>Note:</b> NO FILES OR FOLDERS are sent to any server. Uploading happens only in your browser.</em>
  </p>
</Info>

<style>
  .controls-row {
    margin-bottom: 1rem;
    max-width: 250px;
  }

  .drop-container {
      margin-bottom: 1rem;
  }

  .result-section {
      margin-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
  }

  .download-btn-container {
      margin-top: 0.5rem;
      text-align: right;
  }
</style>