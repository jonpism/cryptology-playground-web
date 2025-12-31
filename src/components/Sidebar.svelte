<script>
  import { createEventDispatcher } from 'svelte';
  
  export let menuStructure = [];
  export let activeTool = null;

  const dispatch = createEventDispatcher();
  
  // search Logic
  let searchQuery = "";
  let searchResults = [];

  $: {
    const query = searchQuery.toLowerCase().trim();
    if (query === "") {
      searchResults = [];
    } else {
      searchResults = menuStructure.flatMap(section => 
        section.items.filter(item => 
          item.name.toLowerCase().includes(query)
        )
      );
    }
  }

  function handleSelect(item) {
    dispatch('select', item);
    // clear search after selection to return to menu
    // searchQuery = ""; 
  }

</script>

<nav class="sidebar">
  <button class="home-btn" on:click={() => dispatch('home')}>
    <h2>Cryptology's Playground</h2>
  </button>

  <button 
      class="terminal-btn" 
      on:click={() => dispatch('openTerminal')}
      title="Open Terminal"
    >
      &gt;_
    </button>
  
  <div class="search-wrapper">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        placeholder="Search for a tool..." 
        bind:value={searchQuery} 
      />
      {#if searchQuery}
        <button class="clear-btn" on:click={() => searchQuery = ""}>✕</button>
      {/if}
    </div>
  </div>

  {#if searchQuery.trim() !== ""}
    <div class="results-container">
      {#if searchResults.length > 0}
        <div class="section-header" style="cursor: default;">Search Results</div>
        <div class="dropdown-content" style="display: flex;">
          {#each searchResults as item}
            <button 
              class="tool-btn" 
              class:active={activeTool === item}
              on:click={() => handleSelect(item)}
            >
              {item.name}
            </button>
          {/each}
        </div>
      {:else}
        <div class="no-results">
          No tools found for "{searchQuery}"
        </div>
      {/if}
    </div>

  {:else}
    {#each menuStructure as section, i}
      <button class="section-header" on:click={() => dispatch('toggle', i)}>
        <span class="section-title">
          {section.icon} {section.category}
        </span>
        <span class="arrow" class:rotated={section.expanded}>▶</span>
      </button>
      
      {#if section.expanded}
        <div class="dropdown-content">
          {#each section.items as item}
            <button 
              class="tool-btn" 
              class:active={activeTool === item}
              on:click={() => dispatch('select', item)}
            >
              {item.name}
            </button>
          {/each}
        </div>
      {/if}
      
      <div class="divider"></div>
    {/each}
  {/if}
</nav>

<style>
  .sidebar {
    width: 320px;
    background-color: #1e293b;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    overflow-y: auto;
    flex-shrink: 0;
    user-select: none;
  }
  
  .home-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 100%;
    transition: transform 0.1s;
  }
  
  .home-btn:hover h2 { color: #93c5fd; }
  .home-btn:active { transform: scale(0.98); }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .terminal-btn {
    background: #0f172a;
    border: 1px solid #334155;
    color: #cbd5e1;
    cursor: pointer;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    font-family: monospace;
    font-weight: bold;
    font-size: 0.9rem;
    transition: all 0.2s;
    min-width: 40px;
    max-width: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 50px;
  }

  .terminal-btn:hover {
    color: #4ade80;
    border-color: #4ade80;
    background: rgba(74, 222, 128, 0.1);
  }

  .terminal-btn:active {
    transform: scale(0.95);
  }

  .search-wrapper {
    padding: 0 1.2rem 1.5rem 1.2rem;
  }
  
  .sidebar h2 {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 1rem; /* reduced to fit search */
    color: #60a5fa;
    pointer-events: none;
  }

  .search-wrapper {
    padding: 1rem 1.5rem 1.5rem 1.2rem;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 0.5rem 0.8rem;
    transition: border-color 0.2s;
  }
  
  .search-box:focus-within {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
  }

  .search-icon {
    font-size: 0.9rem;
    margin-right: 0.5rem;
    opacity: 0.6;
  }

  .search-box input {
    background: transparent;
    border: none;
    color: white;
    width: 100%;
    outline: none;
    font-size: 0.9rem;
  }

  .search-box input::placeholder {
    color: #64748b;
  }

  .clear-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0;
    margin-left: 0.5rem;
  }
  .clear-btn:hover { color: white; }

  .no-results {
    padding: 1rem 1.5rem;
    color: #64748b;
    font-style: italic;
    font-size: 0.9rem;
    text-align: center;
  }

  .section-header {
    background: transparent;
    border: none;
    color: #94a3b8;
    padding: 0.75rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: bold;
    width: 100%;
    transition: color 0.2s;
  }

  .section-header:hover {
    color: white;
    background-color: rgba(255,255,255,0.05);
  }

  .arrow { font-size: 0.7rem; transition: transform 0.2s; }
  .arrow.rotated { transform: rotate(90deg); }

  .dropdown-content {
    background-color: #0f172a;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.5rem;
  }

  .tool-btn {
    background: transparent;
    border: none;
    color: #cbd5e1;
    text-align: left;
    padding: 0.6rem 1.5rem 0.6rem 2.5rem;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s;
    width: 100%;
  }

  .tool-btn:hover { color: white; padding-left: 2.8rem; }

  .tool-btn.active {
    color: #60a5fa;
    border-left: 3px solid #60a5fa;
    background-color: rgba(96, 165, 250, 0.1);
  }

  .divider { margin-bottom: 5px; }
</style>