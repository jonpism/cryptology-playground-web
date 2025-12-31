<script>
  export let value;
  export let options = [];
  export let label = "";
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleChange() {
    dispatch('change', value);
  }
</script>

<div class="small-select-wrapper">
  {#if label}
    <span class="label-text">{label}</span>
  {/if}
  
  <div class="select-container">
    <select bind:value on:change={handleChange}>
      {#each options as option}
        {#if typeof option === 'object'}
          <option value={option.value}>{option.label}</option>
        {:else}
          <option value={option}>{option}</option>
        {/if}
      {/each}
    </select>
    <svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </div>
</div>

<style>
  .small-select-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem; /* smaller base font */
    color: #475569;
  }

  .label-text {
    font-weight: 500;
    white-space: nowrap;
  }

  .select-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  select {
    appearance: none; /* hide default browser arrow */
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 0.3rem 1.8rem 0.3rem 0.6rem; /* padding makes room for the arrow */
    font-size: 0.85rem;
    color: #334155;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
    line-height: 1.2;
    min-width: 80px;
  }

  select:hover {
    border-color: #94a3b8;
    background-color: #f1f5f9;
  }

  select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .arrow-icon {
    position: absolute;
    right: 0.4rem;
    width: 14px;
    height: 14px;
    color: #64748b;
    pointer-events: none; /* clicks pass through to the select */
  }
</style>