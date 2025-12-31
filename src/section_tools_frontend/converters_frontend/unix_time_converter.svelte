<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processUnixTime } from '../../section_tools_js/converters_js/unix_time_converter.js';

  let inputVal = "";
  let mode = "unix2human"; // 'unix2human' or 'human2unix'
  
  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "unix2human", label: "Unix Timestamp to Date" },
    { value: "human2unix", label: "Date to Unix Timestamp" }
  ];

  function runConverter() {
    if (!inputVal) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processUnixTime(inputVal, mode);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function setCurrentTime() {
    if (mode === 'unix2human') {
      // set current timestamp (seconds)
      inputVal = Math.floor(Date.now() / 1000).toString();
    } else {
      // set current date string for input (YYYY-MM-DDTHH:mm)
      // JS toISOString returns UTC, adjust for local input simply
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      inputVal = now.toISOString().slice(0, 16);
    }
    if (autoUpdate) runConverter();
  }

  function swapModes() {
    mode = (mode === 'unix2human') ? 'human2unix' : 'unix2human';
    inputVal = "";
    result = "";
  }

  $: if (autoUpdate && (inputVal || mode)) {
      runConverter();
  }
</script>

<ToolCard title="Unix Time Converter">
  
  <div class="controls-row">
    <Select 
      label="Mode:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <div style="align-self: flex-end; margin-left: auto; margin-bottom: 1rem;">
       <Button variant="secondary" on:click={setCurrentTime}>
         Use Current Time
       </Button>
    </div>
  </div>

  {#if mode === 'unix2human'}
    <Input 
      label="Unix Timestamp:" 
      bind:value={inputVal} 
      placeholder="e.g. 1672531200" 
      expandable={false}
    />
  {:else}
    <div style="margin-bottom: 1rem;">
      <label style="display:block; font-weight:500; color:#334155; margin-bottom:0.5rem;">Select Date & Time:</label>
      <input 
        type="datetime-local" 
        bind:value={inputVal} 
        style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:6px;"
        on:input={() => { if(autoUpdate) runConverter(); }}
      />
    </div>
  {/if}

  <div class="button-row">
    <Button on:click={runConverter}>Convert</Button>
    <Button variant="secondary" on:click={() => { inputVal = ""; result = ""; }}>Clear</Button>
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

<Info title="About Unix Time" links={[{text: "Unix time - Wikipedia", url: "https://en.wikipedia.org/wiki/Unix_time"}]}>
  <p>
    <strong>Unix Time</strong> (also known as POSIX time) is a system for describing a point in time. 
    It is defined as the number of seconds that have elapsed since <strong>00:00:00 UTC on 1 January 1970</strong> (the Unix Epoch), minus leap seconds.
  </p>
  
  <p>
    It is widely used in operating systems and file formats because it represents time as a single simple integer, 
    making it easy to calculate time differences (just subtract one number from another).
  </p>

</Info>