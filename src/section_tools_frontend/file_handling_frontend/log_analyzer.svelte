<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import FileDropArea from '../../components/FileDropArea.svelte';
  
  import { analyzeLog, getTopItems, generatePieGradient } from '../../section_tools_js/file_handling_js/log_analyzer.js';

  let selectedFile = null;
  let result = null;
  let error = "";
  let isProcessing = false;

  // chart data
  let pieStyle = "";
  let levelData = [];
  let topIps = [];
  let topTimestamps = [];

  const LEVEL_COLORS = {
      'INFO': '#22c55e',     // green
      'DEBUG': '#3b82f6',    // blue
      'WARNING': '#f59e0b',  // orange
      'ERROR': '#ef4444',    // red
      'CRITICAL': '#7f1d1d', // dark red
      'FATAL': '#7f1d1d'
  };

  function handleFileChange(event) {
      if (event.detail && event.detail.length > 0) {
          selectedFile = event.detail[0];
          result = null;
          error = "";
      }
  }

  async function handleAnalyze() {
      if (!selectedFile) {
          error = "Please select a log file.";
          return;
      }

      isProcessing = true;
      error = "";
      result = null;

      try {
          const text = await selectedFile.text();
          
          await new Promise(r => setTimeout(r, 50));
          
          const stats = analyzeLog(text);
          result = stats;
          
          // pie chart
          const sortedLevels = getTopItems(stats.levels, 10);
          levelData = sortedLevels.map(item => ({
              label: item.key,
              count: item.count,
              color: LEVEL_COLORS[item.key] || '#94a3b8' // default gray
          }));
          pieStyle = generatePieGradient(levelData);

          // bar chart
          topIps = getTopItems(stats.ips, 10);

          // timestamps
          topTimestamps = getTopItems(stats.timestamps, 10);

      } catch (e) {
          error = "Analysis Failed: " + e.message;
      } finally {
          isProcessing = false;
      }
  }

  const logFIlesLinks = [{text: "Logging - Wikipedia", url: "https://en.wikipedia.org/wiki/Logging_(computing)"},
    {text: "What are log files? - AWS", url: "https://aws.amazon.com/what-is/log-files/"}
  ];
</script>

<ToolCard title="Log Analyzer">
  
  <div class="drop-container">
      <FileDropArea label="Select Log File (.log, .txt, .json)" on:change={handleFileChange} />
  </div>

  {#if selectedFile}
      <div class="file-badge">📄 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</div>
  {/if}

  <div class="button-row">
      <Button on:click={handleAnalyze} disabled={isProcessing || !selectedFile}>
          {#if isProcessing}Analyzing...{:else}Analyze Log{/if}
      </Button>
      <Button variant="secondary" on:click={() => { selectedFile=null; result=null; }}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="dashboard">
        
        <div class="stats-row">
            <div class="stat-card">
                <span class="stat-val">{result.totalLines}</span>
                <span class="stat-label">Total Lines</span>
            </div>
            <div class="stat-card">
                <span class="stat-val">{Object.keys(result.ips).length}</span>
                <span class="stat-label">Unique IPs</span>
            </div>
            <div class="stat-card">
                <span class="stat-val">{Object.keys(result.levels).length}</span>
                <span class="stat-label">Event Types</span>
            </div>
        </div>

        {#if levelData.length > 0}
            <div class="section">
                <h3>Log Level Distribution</h3>
                <div class="chart-layout">
                    <div class="pie-chart" style:background={pieStyle}></div>
                    
                    <div class="legend">
                        {#each levelData as item}
                            <div class="legend-item">
                                <span class="dot" style:background={item.color}></span>
                                <span class="l-name">{item.label}</span>
                                <span class="l-count">{item.count}</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}

        {#if topIps.length > 0}
            <div class="section">
                <h3>Top Active IP Addresses</h3>
                <div class="bar-chart">
                    {#each topIps as ip}
                        <div class="bar-row">
                            <div class="bar-label">{ip.key}</div>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: {(ip.count / topIps[0].count) * 100}%">
                                    {ip.count}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        {#if topTimestamps.length > 0}
            <div class="section">
                <h3>Peak Activity Times</h3>
                <table class="simple-table">
                    <thead><tr><th>Timestamp</th><th>Events</th></tr></thead>
                    <tbody>
                        {#each topTimestamps as ts}
                            <tr>
                                <td>{ts.key}</td>
                                <td>{ts.count}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}

    </div>
  {/if}

</ToolCard>

<Info title="About Log Analysis" links={logFIlesLinks}>
  <p>
    <strong>Log Analysis</strong> helps debug systems and detect security threats by parsing unstructured text logs.
    This tool is designed to analyze log files and extract useful insights from them.
        Instead of reading thousands of log entries manually, the tool summarizes important information such as:
  </p>
  
  <ul>
    <li><strong>Levels:</strong> Tracks <code>ERROR</code> vs <code>INFO</code> to gauge system health.</li>
    <li><strong>IPs:</strong> Identifies frequent visitors or potential attackers (e.g., a single IP hitting an endpoint 1000 times).</li>
    <li><strong>Timeline:</strong> Shows when the system was busiest.</li>
  </ul>

  <p>The tool supports various log formats including JSON, Windows Event Logs, Common Event Format, 
        NCSA Common Log Format, Extended Log Format, and W3C Extended Log Format. It helps with debugging, 
        security analysis, system monitoring, and troubleshooting.</p>
</Info>

<style>
  .drop-container { margin-bottom: 1rem; }
  .file-badge {
      text-align: center; margin-bottom: 1.5rem; color: #475569; font-size: 0.9rem;
  }
  .button-row { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }

  .dashboard {
      border-top: 1px solid #e2e8f0; padding-top: 1.5rem; animation: fadeIn 0.3s;
  }

  /* summary stats */
  .stats-row {
      display: flex; gap: 1rem; margin-bottom: 2rem;
  }
  .stat-card {
      flex: 1; background: #f8fafc; border: 1px solid #cbd5e1;
      border-radius: 8px; padding: 1rem; text-align: center;
  }
  .stat-val { display: block; font-size: 1.5rem; font-weight: bold; color: #0f172a; }
  .stat-label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; }

  /* sections */
  .section { margin-bottom: 2rem; }
  h3 { font-size: 1.1rem; color: #334155; margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }

  /* pie chart */
  .chart-layout { display: flex; align-items: center; gap: 2rem; }
  .pie-chart {
      width: 120px; height: 120px; border-radius: 50%; border: 1px solid #e2e8f0;
      flex-shrink: 0;
  }
  .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; margin-bottom: 0.3rem; }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .l-name { font-weight: bold; color: #334155; }
  .l-count { color: #64748b; margin-left: auto; }

  /* bar chart */
  .bar-row { display: flex; align-items: center; margin-bottom: 0.5rem; font-size: 0.9rem; }
  .bar-label { width: 120px; color: #334155; font-family: monospace; }
  .bar-track { flex: 1; }
  .bar-fill {
      background: #3b82f6; color: white; padding: 2px 8px;
      border-radius: 4px; font-size: 0.8rem; min-width: 20px; text-align: right;
  }

  /* table */
  .simple-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  .simple-table th { text-align: left; background: #f1f5f9; padding: 0.5rem; }
  .simple-table td { border-bottom: 1px solid #e2e8f0; padding: 0.5rem; color: #334155; }

  @media (max-width: 600px) {
      .chart-layout { flex-direction: column; align-items: flex-start; }
      .bar-label { width: 100px; font-size: 0.8rem; }
  }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>