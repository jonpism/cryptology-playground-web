<script>
  export let label = "";
  export let value = "";
  export let options = [];
</script>

<div class="input-group">
  {#if label} 
    <label>{label}</label> 
  {/if}
  
  <select bind:value on:change>
    {#each options as option}
      {#if typeof option === 'object' && option !== null}
        <option value={option.value}>{option.label}</option>
      {:else}
        <option value={option}>{option}</option>
      {/if}
    {/each}
  </select>
</div>

<style>
  .input-group { 
    margin-bottom: 1.5rem; 
    width: 100%; 
  }
  
  label { 
    display: block; 
    font-weight: bold; 
    margin-bottom: 0.5rem; 
    color: #334155; 
  }
  
  select {
    width: 100%; 
    padding: 0.8rem;
    border: 2px solid #cbd5e1; 
    border-radius: 6px;
    background: white; 
    font-size: 1rem; 
    cursor: pointer;
  }
  
  select:focus { 
    outline: none; 
    border-color: #60a5fa; 
  }
</style>