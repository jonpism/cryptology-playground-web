<script>
  export let title = "About";
  export let links = [];
</script>

<div class="about-section">
  <h3>{title}</h3>
  
  <div class="about-content">
    <slot />
  </div>

  {#if links.length > 0}
    <div class="links-section">
      <h4>Useful Links:</h4>
      <ul>
        {#each links as link}
          <li>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.text}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .about-section {
    background: white; /* clean white background for reading */
    padding: 2rem;
    border-radius: 12px;
    max-width: 1100px; /* ToolCard width */
    margin: 2rem auto 4rem auto; /* scrolling space */
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    color: #334155;
    line-height: 1.6;
  }

  h3 {
    color: #1e293b;
    margin-top: 0;
    border-bottom: 1px dashed #cbd5e1;
    padding-bottom: 0.5rem;
  }

  h4 {
    margin-bottom: 0.5rem;
    color: #0f172a;
  }

  .about-content :global(p) {
    margin-bottom: 1rem;
  }

  .about-content :global(ul) {
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .about-content :global(li) {
    margin-bottom: 0.5rem;
  }

  .links-section {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px dashed #cbd5e1;
  }

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }
</style>