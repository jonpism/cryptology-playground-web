<script>
  export let title = "Tool";
</script>

<div class="card">
  <h2>{title}</h2>
  
  <div class="card-content">
    <slot />
  </div>
</div>

<style>
  .card {
    background: #a9c1d5;
    padding: 2rem;
    border-radius: 12px;
    max-width: 800px; /* consistent width for all tools */
    margin: 0 auto;   /* centers the card */
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    color: #1e293b;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #1e293b;
    padding-bottom: 0.5rem;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* space between inputs */
  }

  .card-content :global(label) {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
    color: #334155;
  }

  .card-content :global(textarea) {
    width: 100%;
    height: 60px;
    max-height: 300px;
    padding: 0.8rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #f8fafc;
    font-family: monospace;
    box-sizing: border-box;
    color: #334155;
    font-size: 0.9rem;
    
    /* FIX: Change 'none' to 'vertical' so users can resize inputs! */
    resize: vertical; 
  }

  .card-content :global(.controls-row) {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .card-content :global(.button-row) {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .card-content :global(.msg) {
    padding: 1rem; 
    border-radius: 6px; 
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .card-content :global(.msg.error) {
    background: #fee2e2; 
    color: #ef4444;
  }

  .card-content :global(.result-box) {
    margin-bottom: 1rem;
  }

</style>
