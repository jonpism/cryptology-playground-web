<script>
  export let disabled = false;
  
  export let variant = "primary";
</script>

<button 
  class="btn {variant}" 
  {disabled} 
  on:click
>
  <slot /> </button>

<style>
  .btn {
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px; /* space between icon and text */
    min-width: 120px;
  }
  
  .primary {
    background-color: #3b82f6; /* blue-500 */
    color: white;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }
  .primary:hover:not(:disabled) {
    background-color: #2563eb; /* blue-600 */
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.4);
  }

  .secondary {
    background-color: #e2e8f0;
    color: #475569;
  }
  .secondary:hover:not(:disabled) {
    background-color: #cbd5e1;
  }

  .danger {
    background-color: #ef4444;
    color: white;
  }
  .danger:hover:not(:disabled) {
    background-color: #dc2626;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #94a3b8 !important; /* force grey */
    box-shadow: none;
    transform: none;
  }
  
  .btn:active:not(:disabled) {
    transform: translateY(0);
  }
</style>