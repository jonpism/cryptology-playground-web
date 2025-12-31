<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { commands } from '../terminal_commands_js/index.js';
  
  const dispatch = createEventDispatcher();
  let inputElement;
  let terminalWindow;
  
  // virtual file system
  let virtualFiles = {}; 

  let history = [
    { type: 'info', text: 'Cryptology Playground Terminal [Version 1.0.0]' },
    { type: 'info', text: '(c) 2025 Cryptology Inc. All rights reserved.' },
    { type: 'info', text: 'Type `help` to view the available commands' },
    { type: 'br', text: '' }
  ];
  
  let command = "";
  let commandHistory = [];
  let historyIndex = -1;
  let isDragging = false;
  const MAX_SIZE = 50 * 1024 * 1024;

  onMount(() => {
    inputElement.focus();
    scrollToBottom();
  });

  async function scrollToBottom() {
    await tick();
    if (terminalWindow) {
      terminalWindow.scrollTop = terminalWindow.scrollHeight;
    }
  }

  function autoResize() {
    if (inputElement) {
      inputElement.style.height = 'auto';
      inputElement.style.height = inputElement.scrollHeight + 'px';
    }
  }

  // drag and drop
  function handleDragOver(e) { e.preventDefault(); isDragging = true; }
  function handleDragLeave(e) { isDragging = false; }
  async function handleDrop(e) {
    e.preventDefault();
    isDragging = false;

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          const file = e.dataTransfer.items[i].getAsFile();

          if (file.size > MAX_SIZE){
            history = [...history, { 
              type: 'error', 
              text: `[-] Error: "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Limit is 50MB.` 
            }];
            continue;
          }
          try{
            // raw binary
            const buffer = await file.arrayBuffer();
            // Uint8Array
            const uint8View = new Uint8Array(buffer);
            
            virtualFiles[file.name] = uint8View;
            
            history = [...history, { type: 'success', text: `[+] Loaded file: ${file.name} (${file.size} bytes)` }];
          }catch (err){
            history = [...history, { type: 'error', text: `[-] Failed to load ${file.name}` }];
          }
        }
      }
    }
    scrollToBottom();
  }

  // autocomplete
  function handleTabCompletion(e) {
    e.preventDefault(); // stop focus change

    // current word being typed (everything after the last space)
    const lastSpaceIndex = command.lastIndexOf(' ');
    const partialName = lastSpaceIndex === -1 ? command : command.substring(lastSpaceIndex + 1);

    if (!partialName) return;

    // find matches in virtualFiles
    const availableFiles = Object.keys(virtualFiles);
    const matches = availableFiles.filter(name => name.startsWith(partialName));

    // fill it in, if there is match
    if (matches.length === 1) {
      const match = matches[0];
      
      if (lastSpaceIndex === -1) {
        command = match;
      } else {
        // keep the beginning, replace the end
        command = command.substring(0, lastSpaceIndex + 1) + match;
      }
    } 
    else if (matches.length > 1) {
    }
  }

  // command handling
  async function handleCommand() {
    const cmdRaw = command.trim();
    if (!cmdRaw) {
      command = "";
      if(inputElement) inputElement.style.height = 'auto';
      return;
    }

    // add to history
    history = [...history, { type: 'user', text: cmdRaw }];
    commandHistory.push(cmdRaw);
    historyIndex = commandHistory.length;

    // split by '|'
    // "strings file.png | grep pp" -> ["strings file.png", " grep pp"]
    const segments = cmdRaw.split('|');
    
    let previousOutput = null; // stdin
    let finalResult = null;
    let errorOccurred = false;

    // process chain
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i].trim();
      
      // individual command: "grep pp" -> action="grep", args=["pp"]
      // handle spaces vs quotes roughly
      const args = segment.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
      
      if (args.length === 0) continue;
      
      const action = args[0].toLowerCase();
      const params = args.slice(1);

      // special system commands
      if (i === 0) {
        if (action === 'clear') { history = []; command = ""; if(inputElement) inputElement.style.height = 'auto'; return; }
        if (action === 'exit') { dispatch('close'); return; }
      }

      if (commands[action]) {
        // execute command
        const result = commands[action](params, virtualFiles, previousOutput);

        if (result && result.type === 'error') {
           history = [...history, result];
           errorOccurred = true;
           break; // stop chain on error
        }

        // capture output for the next pipe
        if (result && result.text) {
           previousOutput = result.text;
           finalResult = result;
        } else {
           previousOutput = ""; // command produced no output (e.g. silent grep)
           finalResult = null;
        }

      } else {
        history = [...history, { type: 'error', text: `Command not found: ${action}` }];
        errorOccurred = true;
        break;
      }
    }

    // display final result
    if (!errorOccurred && finalResult) {
       history = [...history, finalResult];
    }

    // cleanup
    command = "";
    if(inputElement) inputElement.style.height = 'auto';
    scrollToBottom();
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        handleCommand();
      } else {
        tick().then(autoResize);
      }
    } 
    // tab key
    else if (e.key === 'Tab') {
      handleTabCompletion(e);
    }
    else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        e.preventDefault();
        historyIndex--;
        command = commandHistory[historyIndex];
        tick().then(autoResize);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        e.preventDefault();
        historyIndex++;
        command = commandHistory[historyIndex];
        tick().then(autoResize);
      } else {
        historyIndex = commandHistory.length;
        command = "";
        tick().then(autoResize);
      }
    }
  }

  function handleContainerClick() {
    inputElement.focus();
  }
</script>

<div class="terminal-wrapper" 
     class:dragging={isDragging}
     on:dragover={handleDragOver}
     on:dragleave={handleDragLeave}
     on:drop={handleDrop}>

  <div class="terminal-header">
    <div class="buttons">
      <span class="dot red" on:click={() => dispatch('close')} title="Close"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
    </div>
    <div class="title">user@crypto-playground:~</div>
  </div>
  
  <div class="terminal-body" bind:this={terminalWindow} on:click={handleContainerClick}>
    {#each history as line}
      {#if line.type === 'user'}
        <div class="line user">
          <span class="prompt">➜</span>
          <span class="path">~</span>
          <span class="cmd" style="white-space: pre-wrap;">{line.text}</span>
        </div>
      {:else if line.type === 'br'}
        <br>
      {:else if line.type === 'code'}
        <div class="line code">{line.text}</div>
      {:else}
        <div class="line {line.type}">{line.text}</div>
      {/if}
    {/each}
    
    <div class="input-line">
      <span class="prompt">➜</span>
      <span class="path">~</span>
      <textarea 
        bind:this={inputElement}
        bind:value={command}
        on:keydown={handleKeydown}
        on:input={autoResize}
        rows="1"
        spellcheck="false" 
        autocomplete="off"
      ></textarea>
    </div>
  </div>
</div>

<style>
  .terminal-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #0f172a;
    color: #e2e8f0;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.95rem;
    transition: border 0.2s, background-color 0.2s; /* smooth drag effect */
  }

  /* drag visual feedback */
  .terminal-wrapper.dragging {
    border: 2px dashed #4ade80;
    background-color: rgba(15, 23, 42, 0.95);
  }

  /* window controls */
  .terminal-header {
    background-color: #1e293b;
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #334155;
    flex-shrink: 0;
  }

  .buttons { display: flex; gap: 8px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; cursor: pointer; transition: transform 0.1s; }
  .dot:hover { transform: scale(1.1); }
  .red { background-color: #ef4444; }
  .yellow { background-color: #f59e0b; }
  .green { background-color: #22c55e; }

  .title {
    margin-left: auto;
    margin-right: auto;
    color: #94a3b8;
    font-size: 0.85rem;
    font-weight: bold;
    opacity: 0.8;
  }

  /* body */
  .terminal-body {
    flex-grow: 1;
    padding: 1rem;
    overflow-y: auto;
    cursor: text;
  }

  /* lines */
  .line {
    margin-bottom: 4px;
    line-height: 1.4;
    word-break: break-all;
  }

  .line.code {
    color: #a5f3fc;
    font-family: 'Courier New', Courier, monospace; 
    white-space: pre; /* preserves spaces and newlines strictly */
    overflow-x: auto;
    margin-bottom: 4px;
  }

  .line.user { display: flex; gap: 8px; margin-top: 8px; }
  .prompt { color: #22c55e; font-weight: bold; flex-shrink: 0; }
  .path { color: #3b82f6; font-weight: bold; flex-shrink: 0; }
  .cmd { color: #f8fafc; }

  .line.info { color: #94a3b8; white-space: pre-wrap;}
  .line.response { color: #cbd5e1; white-space: pre-wrap; }
  .line.success { color: #4ade80; }
  .line.error { color: #f87171; }

  /* input area */
  .input-line {
    display: flex;
    gap: 8px;
    align-items: flex-start; /* multi-line support */
    margin-top: 8px;
  }

  textarea {
    background: transparent;
    border: none;
    color: #f8fafc;
    font-family: inherit;
    font-size: inherit;
    flex-grow: 1;
    outline: none;
    padding: 0;
    margin: 0;
    resize: none; /* hide drag handle */
    overflow: hidden; /* hide scrollbar */
    min-height: 1.4em;
    line-height: 1.4;
    display: block;
  }
</style>