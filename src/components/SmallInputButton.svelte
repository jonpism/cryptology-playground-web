<script>
  export let value;         
  export let label = "";    
  export let suffix = "";   
  export let min = 0;
  export let step = 1;

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleInput() {
    dispatch('input', value);
  }
</script>

<div class="small-input-wrapper">
  {#if label}
    <span class="label-text">{label}</span>
  {/if}
  
  <div class="input-container">
    <input 
      type="number" 
      bind:value 
      {min} 
      {step} 
      on:input={handleInput}
    />
    {#if suffix}
      <span class="suffix">{suffix}</span>
    {/if}
  </div>
</div>

<style>
  .small-input-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    color: #475569;
  }

  .label-text {
    font-weight: 500;
    white-space: nowrap;
  }

  .input-container {
    display: flex;
    align-items: center;
    background-color: #fff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s;
  }

  .input-container:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  input {
    border: none;
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
    color: #334155;
    outline: none;
    width: 80px;
    appearance: textfield; /* removes default arrows */
  }
  
  /* remove arrows in Chrome/Safari */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .suffix {
    padding: 0.3rem 0.6rem;
    background-color: #f8fafc;
    border-left: 1px solid #cbd5e1;
    color: #64748b;
    font-weight: 500;
    font-size: 0.8rem;
    user-select: none;
  }
</style>