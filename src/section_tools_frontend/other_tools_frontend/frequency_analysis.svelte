<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { analyzeFrequency } from '../../section_tools_js/other_tools_js/frequency_analysis.js';

  let inputText = "";
  let analysisResult = null;
  let error = "";
  let autoUpdate = true;

  // chart configuration 
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  let width = 600;  // SVG internal width
  let height = 300; // SVG internal height
  
  // reactive chart data
  let bars = [];
  let yTicks = [];

  $: if (analysisResult && analysisResult.data.length > 0) {
      calculateChart(analysisResult.data);
  }

  function handleAnalyze() {
      error = "";
      analysisResult = null;
      try {
          analysisResult = analyzeFrequency(inputText);
      } catch (e) {
          error = e.message;
      }
  }

  function loadExample() {
      inputText = "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once!";
      handleAnalyze();
  }

  // scaling
  function calculateChart(data) {
      // dimensions of the drawing area
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // y-scale
      const maxVal = Math.max(...data.map(d => d.percent));
      const yMax = Math.ceil(maxVal / 5) * 5; // round up to nearest 5 for nice ticks
      
      const yScale = (val) => innerHeight - ((val / yMax) * innerHeight);

      // x-scale
      // distribute bars evenly
      const barPadding = 5;
      const step = innerWidth / data.length;
      const barWidth = step - barPadding;

      // generate bars
      bars = data.map((d, i) => {
          const x = margin.left + (i * step) + (barPadding / 2);
          const y = margin.top + yScale(d.percent);
          const h = innerHeight - yScale(d.percent);
          return {
              x, y, 
              width: barWidth, 
              height: h,
              label: d.char.toUpperCase(),
              value: d.percent,
              count: d.count
          };
      });

      // generate y-axis ticks
      yTicks = [];
      const numTicks = 5;
      for (let i = 0; i <= numTicks; i++) {
          const val = (yMax / numTicks) * i;
          yTicks.push({
              val: val,
              y: margin.top + yScale(val),
              label: val.toFixed(0) + '%'
          });
      }
  }

  $: if (autoUpdate && (inputText)) {
      handleAnalyze();}

  const freqAnalysisLinks = [{text: "Wikipedia: Frequency Analysis", url: "https://en.wikipedia.org/wiki/Frequency_analysis"},
  {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/frequency-analysis/"}
  ];
</script>

<ToolCard title="Frequency Analysis">
  
  <Input 
    label="Input Text:" 
    bind:value={inputText} 
    placeholder="Paste text to analyze here..." 
    expandable={true} 
    rows={6}
  />

  <div class="button-row">
    <Button on:click={handleAnalyze}>Analyze Frequency</Button>
    <Button variant="secondary" on:click={loadExample}>Load Example</Button>
    <Button variant="secondary" on:click={() => { inputText=""; analysisResult=null; }}>Clear</Button>

    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if analysisResult}
    <div class="results-area">
        
        <div class="chart-container">
            <h3 class="chart-title">Character Frequency Histogram</h3>
            
            <svg viewBox="0 0 {width} {height}" class="chart-svg">
                
                <g class="grid">
                    {#each yTicks as tick}
                        <line 
                            x1={margin.left} 
                            y1={tick.y} 
                            x2={width - margin.right} 
                            y2={tick.y} 
                            stroke="#e2e8f0" 
                            stroke-dasharray="4"
                        />
                    {/each}
                </g>

                <line 
                    x1={margin.left} y1={margin.top} 
                    x2={margin.left} y2={height - margin.bottom} 
                    stroke="#334155" stroke-width="1" 
                /> <line 
                    x1={margin.left} y1={height - margin.bottom} 
                    x2={width - margin.right} y2={height - margin.bottom} 
                    stroke="#334155" stroke-width="1" 
                /> <g class="y-labels">
                    <text 
                        x="15" 
                        y={height / 2} 
                        transform="rotate(-90, 15, {height/2})" 
                        text-anchor="middle" 
                        class="axis-title"
                    >Frequency</text>

                    {#each yTicks as tick}
                        <text 
                            x={margin.left - 10} 
                            y={tick.y + 4} 
                            text-anchor="end" 
                            class="tick-label"
                        >{tick.label}</text>
                    {/each}
                </g>

                <g class="bars">
                    {#each bars as bar}
                        <rect 
                            x={bar.x} 
                            y={bar.y} 
                            width={bar.width} 
                            height={bar.height} 
                            fill="#4169E1"
                            stroke="#2b50c0"
                            stroke-width="1"
                            rx="2"
                        >
                            <title>{bar.label}: {bar.value.toFixed(2)}% ({bar.count})</title>
                        </rect>
                        
                        <text 
                            x={bar.x + bar.width / 2} 
                            y={height - margin.bottom + 15} 
                            text-anchor="middle" 
                            class="tick-label-x"
                        >{bar.label}</text>
                    {/each}
                </g>
                
                <text 
                    x={width / 2} 
                    y={height - 5} 
                    text-anchor="middle" 
                    class="axis-title"
                >Characters</text>

            </svg>
        </div>

        <div class="stats-panel">
            <div class="stat-row">
                <span>Total Characters:</span> <strong>{analysisResult.totalChars}</strong>
            </div>
            <div class="stat-row">
                <span>Unique:</span> <strong>{analysisResult.uniqueChars}</strong>
            </div>
            <div class="stat-row">
                <span>Most Common:</span> <strong>{analysisResult.mostCommon.char.toUpperCase()} ({analysisResult.mostCommon.percent.toFixed(2)}%)</strong>
            </div>
        </div>

    </div>
  {/if}

</ToolCard>

<Info title="About Frequency Analysis" links = {freqAnalysisLinks}>
  <p>This tool helps in performing <b>frequency analysis</b> on a given text. 
    Frequency analysis is a method for analyzing the frequency of letters in a text, 
    which is often used in cryptography to break substitution ciphers.</p>

    <p>Features include:</p>
    <ul>
    <li>Displaying a frequency table of characters </li>
    <li>Identifying the most common character </li>
    <li>Generating a histogram to visualize character frequencies </li>
    </ul>

  <p>
    In English, <strong>E</strong> is usually the most common letter (~12.7%), followed by <strong>T</strong>, <strong>A</strong>, and <strong>O</strong>.
  </p>
</Info>

<style>
  .button-row {
    margin-bottom: 1.5rem;
    display: flex;
    gap: 0.5rem;
  }

  .results-area {
    margin-top: 1.5rem;
    animation: fadeIn 0.3s ease-out;
  }

  .chart-container {
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
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

  .axis-title {
      font-size: 12px;
      font-weight: bold;
      fill: #333;
      margin: auto;
  }

  .tick-label {
      font-size: 10px;
      fill: #666;
  }

  .tick-label-x {
      font-size: 10px;
      font-weight: bold;
      fill: #333;
  }

  .bars rect {
      transition: height 0.3s ease, y 0.3s ease;
      cursor: pointer;
  }
  
  .bars rect:hover {
      fill: #2b50c0;
  }

  .stats-panel {
      margin-top: 1.5rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
  }
  
  .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 0.3rem 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.9rem;
  }
  .stat-row:last-child { border-bottom: none; }

  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
  }
</style>