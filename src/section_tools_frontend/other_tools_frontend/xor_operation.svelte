<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { calculateXor } from '../../section_tools_js/other_tools_js/xor_operation';

  let var1 = "";
  let var2 = "";
  let result = "";
  let error = "";
  let autoUpdate = true;

  function handleXor() {
      error = "";
      result = "";

      try {
          result = calculateXor(var1, var2);
      } catch (e) {
          error = e.message;
      }
  }

  function clearAll() {
      var1 = "";
      var2 = "";
      result = "";
      error = "";
  }

  $: if (autoUpdate && var1 && var2) {
      handleXor();
  }

  const xorLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Exclusive_or"}];

</script>

<ToolCard title="XOR Operation">
  
  <div class="operation-layout">
      
      <div class="input-col">
          <Input 
              label="Variable 1 (Binary):" 
              bind:value={var1} 
              placeholder="e.g. 1010" 
          />
      </div>

      <div class="operator-icon" title="Exclusive OR">
          ⊕
      </div>

      <div class="input-col">
          <Input 
              label="Variable 2 (Binary):" 
              bind:value={var2} 
              placeholder="e.g. 0110" 
          />
      </div>

  </div>

  <div class="button-row">
    <Button on:click={handleXor}>Compute XOR</Button>
    <Button variant="secondary" on:click={clearAll}>Clear</Button>

    <div style="margin-left: auto">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <div class="result-area">
        <Input 
            label="Result:" 
            value={result} 
            readonly={true} 
            withCopy={true}
        />
        
        <div class="logic-explanation">
            Logic: <strong>1</strong> if bits differ, <strong>0</strong> if bits match.
        </div>
    </div>
  {/if}

</ToolCard>

<Info title="About XOR (Exclusive OR)" links={xorLinks}>

    <p><b>The XOR (Exclusive OR)</b> operation is a fundamental binary operation used in digital logic and computing.
    It takes two binary inputs and outputs a binary result. In XOR, the result is <strong>1</strong> if the two 
    inputs are different (one input is 1 and the other is 0), and the result is <strong>0</strong> if the inputs 
    are the same (both 0 or both 1).</p>
    
    <p>The XOR operation is symbolized by ⊕ or ^, and it is widely used in fields such as cryptography, error detection,
    computer graphics, and data encoding.</p>

    <p><strong>Applications of XOR Operation:</strong></p>
    <ul>
    <li><strong>Cryptography:</strong> XOR is a foundational operation in encryption algorithms. 
    The simplicity and reversibility of XOR make it useful in symmetric encryption, 
    such as the XOR cipher. Modern cryptographic algorithms use XOR in combination 
    with other operations for secure data encoding.</li>
    <li><strong>Error Detection:</strong> XOR is commonly used in parity checks and checksums, 
    which help detect data corruption in storage or transmission.</li>
    <li><strong>Data Manipulation:</strong> XOR can swap values without needing a temporary variable. 
    For example, to swap two integers A and B, one can use XOR: 
    <code>A = A ⊕ B; B = A ⊕ B; A = A ⊕ B;</code>. This approach is efficient for 
    low-level programming and embedded systems.</li>
    <li><strong>Pseudorandom Number Generation:</strong> XOR is often used in pseudorandom 
    number generators to achieve bitwise randomness and efficiency.</li>
    </ul>
  
  <h3>Truth Table</h3>
  <table class="truth-table">
      <thead>
          <tr>
              <th>A</th>
              <th>B</th>
              <th>A ⊕ B</th>
          </tr>
      </thead>
      <tbody>
          <tr><td>0</td><td>0</td><td>0</td></tr>
          <tr><td>0</td><td>1</td><td>1</td></tr>
          <tr><td>1</td><td>0</td><td>1</td></tr>
          <tr><td>1</td><td>1</td><td>0</td></tr>
      </tbody>
  </table>

</Info>

<style>
  .operation-layout {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
  }

  .input-col {
      flex: 1;
  }

  .operator-icon {
      font-size: 2rem;
      color: #64748b;
      font-weight: bold;
      padding-top: 1rem;
      user-select: none;
  }

  .button-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
  }

  .result-area {
      margin-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1.5rem;
  }

  .logic-explanation {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #64748b;
      text-align: center;
  }

  .truth-table {
      width: 100%;
      max-width: 300px;
      margin: 1rem 0;
      border-collapse: collapse;
      text-align: center;
  }
  
  .truth-table th, .truth-table td {
      border: 1px solid #cbd5e1;
      padding: 0.5rem;
  }

  .truth-table th {
      background: #f1f5f9;
  }

  @media (max-width: 600px) {
      .operation-layout { flex-direction: column; gap: 0.5rem; }
      .operator-icon { transform: rotate(90deg); padding: 0; }
  }
</style>