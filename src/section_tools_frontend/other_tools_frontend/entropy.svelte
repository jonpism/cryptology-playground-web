<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { calculateEntropy } from '../../section_tools_js/other_tools_js/entropy.js';

  let inputText = "";
  let result = null;
  let error = "";
  let autoUpdate = true;

  // chart config
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  let width = 600;
  let height = 300;
  
  // reactive chart data
  let bars = [];
  let yTicks = [];

  $: if (result && result.distribution.length > 0) {
      calculateChart(result.distribution);
  }

  function handleCalculate() {
      error = "";
      result = null;

      if (!inputText) {
          error = "Please enter text data.";
          return;
      }

      try {
          result = calculateEntropy(inputText);
      } catch (e) {
          error = e.message;
      }
  }

  function loadExample() {
      // string with some repetition
      inputText = "AAAAAA BBBBBB CCCCCC 1234567890 !@#$%^&*()";
      handleCalculate();
  }

  function calculateChart(data) {
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // y values (Probability)
      const maxP = Math.max(...data.map(d => d.probability));
      // round up maxP for nice axis
      const yMax = Math.ceil(maxP * 10) / 10 || 0.1;
      
      const yScale = (val) => innerHeight - ((val / yMax) * innerHeight);

      // x values (Bytes)
      const step = innerWidth / data.length;
      const barWidth = Math.max(2, step - 2); // ensure visible bars

      bars = data.map((d, i) => {
          return {
              x: margin.left + (i * step),
              y: margin.top + yScale(d.probability),
              height: innerHeight - yScale(d.probability),
              width: barWidth,
              ...d
          };
      });

      // y ticks
      yTicks = [];
      const numTicks = 5;
      for (let i = 0; i <= numTicks; i++) {
          const val = (yMax / numTicks) * i;
          yTicks.push({
              val: val,
              y: margin.top + yScale(val),
              label: val.toFixed(2)
          });
      }
  }

  $: if (autoUpdate && inputText) {
      handleCalculate();}

    const entropyLinks = [{text: "Entropy (Information theory) - Wikipedia", url: "https://en.wikipedia.org/wiki/Entropy_(information_theory)"}];
</script>

<ToolCard title="Shannon Entropy Calculator">
  
  <Input 
    label="Input Data:" 
    bind:value={inputText} 
    placeholder="Enter text to analyze..." 
    expandable={true} 
    rows={4}
  />

  <div class="button-row">
    <Button on:click={handleCalculate}>Calculate Entropy</Button>
    <Button variant="secondary" on:click={loadExample}>Load Example</Button>
    <Button variant="secondary" on:click={() => { inputText=""; result=null; }}>Clear</Button>

    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="results-area">
        
        <div class="entropy-display">
            <span class="value">Shannon Entropy: {result.entropy.toFixed(5)} bits/byte</span>
        </div>

        <div class="chart-container">
            <h3 class="chart-title">Byte Frequency Distribution</h3>
            
            <svg viewBox="0 0 {width} {height}" class="chart-svg">
                
                <g class="grid">
                    {#each yTicks as tick}
                        <line 
                            x1={margin.left} y1={tick.y} 
                            x2={width - margin.right} y2={tick.y} 
                            stroke="#e2e8f0" stroke-dasharray="4"
                        />
                        <text 
                            x={margin.left - 10} y={tick.y + 4} 
                            text-anchor="end" class="tick-label"
                        >{tick.label}</text>
                    {/each}
                </g>

                <line 
                    x1={margin.left} y1={margin.top} 
                    x2={margin.left} y2={height - margin.bottom} 
                    stroke="#334155"
                />
                <line 
                    x1={margin.left} y1={height - margin.bottom} 
                    x2={width - margin.right} y2={height - margin.bottom} 
                    stroke="#334155"
                />

                <g class="bars">
                    {#each bars as bar}
                        <rect 
                            x={bar.x} y={bar.y} 
                            width={bar.width} height={bar.height} 
                            fill="#4169E1" stroke="#2b50c0" stroke-width="1"
                        >
                            <title>Byte: {bar.byte} ({bar.hex})&#10;Char: {bar.char}&#10;Prob: {bar.probability.toFixed(4)}</title>
                        </rect>
                    {/each}
                </g>

                <text 
                    x={15} y={height / 2} 
                    transform="rotate(-90, 15, {height/2})" 
                    text-anchor="middle" class="axis-title"
                >Probability</text>
                
                <text 
                    x={width / 2} y={height - 5} 
                    text-anchor="middle" class="axis-title"
                >Byte Value (Sorted)</text>

            </svg>
        </div>

        <div class="stats-footer">
            <div>Total Bytes: <strong>{result.totalBytes}</strong></div>
            <div>Unique Bytes: <strong>{result.distribution.length}</strong></div>
            <div>Max Possible Entropy: <strong>8.00 bits</strong></div>
        </div>
    </div>
  {/if}

</ToolCard>

<Info title="About Shannon Entropy" links={entropyLinks}>

    <p><strong>Shannon Entropy</strong> is a measure of the randomness or information density in a file. 
    It is measured in <strong>bits per byte</strong>. This tool calculates the Shannon entropy of the provided input data, 
    a measurement used in information theory to assess the randomness or unpredictability of data. 
    It provides a visualization of the frequency distribution of byte values in the data.</p>

    <ul>
    <li><strong>0.0 bits:</strong> No randomness (e.g., "AAAAA"). Contains zero information.</li>
    <li><strong>8.0 bits:</strong> Maximum randomness (e.g., random noise or encrypted data). Each byte is unpredictable.</li>
    <li><strong>English Text:</strong> Typically around 3.5 - 4.5 bits/byte.</li>
  </ul>

    <h4>Features:</h4>
    <ul>
    <li>Calculates Shannon entropy, a common metric in data analysis and cryptography.</li>
    <li>Generates a histogram to show the distribution of byte values in the data.</li>
    <li>Supports custom text input and provides results with a single button click.</li>
    </ul>

    <h4>Usage Instructions:</h4>
    <ol>
    <li>Enter the text data into the input field at the top.</li>
    <li>Click the <b>Calculate Entropy</b> button to calculate the entropy and generate a histogram.</li>
    <li>The calculated entropy will display below the input, and the histogram will appear beneath it.</li>
    </ol>
    
    <p><b>Note:</b> Entropy values are particularly useful in fields like cryptography, data compression, and 
    randomness testing.</p>
  
</Info>

<style>
  .entropy-display {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 6px;
      text-align: center;
      color: #0369a1;
  }

  .entropy-display .value {
      font-size: 1.8rem;
      font-weight: bold;
  }

  .chart-container {
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 1rem;
  }

  .chart-title {
      text-align: center;
      margin: 0.5rem 0 1rem 0;
      color: #333;
      font-size: 1.1rem;
  }

  .chart-svg {
      width: 100%;
      height: auto;
      max-height: 350px;
      font-family: sans-serif;
  }

  .axis-title { font-size: 12px; font-weight: bold; fill: #333; }
  .tick-label { font-size: 10px; fill: #666; }

  .bars rect {
      transition: height 0.3s ease, y 0.3s ease;
      cursor: pointer;
  }
  .bars rect:hover { fill: #2b50c0; }

  .stats-footer {
      display: flex;
      justify-content: space-around;
      background: #f8fafc;
      padding: 0.8rem;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      font-size: 0.9rem;
  }

  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
  }
</style>