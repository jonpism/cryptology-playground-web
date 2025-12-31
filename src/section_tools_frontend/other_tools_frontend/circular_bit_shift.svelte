<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  
  import { circularLeftShift, circularRightShift } from '../../section_tools_js/other_tools_js/circular_bit_shift.js';

  let numberInput = "";
  let shiftInput = "";
  let bitWidthStr = "32"; // default

  let resultROL = null;
  let resultROR = null;
  let error = "";
  let autoUpdate = true;

  const bitWidthOptions = [
    { value: "8", label: "8-bit" },
    { value: "16", label: "16-bit" },
    { value: "32", label: "32-bit" },
    { value: "64", label: "64-bit" }
  ];

  function calculate() {
      error = "";
      resultROL = null;
      resultROR = null;

      if (!numberInput) return error = "Please enter a number.";
      if (!shiftInput) return error = "Please enter shift amount.";

      const bitWidth = parseInt(bitWidthStr);

      try {
          // ensure inputs are positive integers
          if (!/^\d+$/.test(numberInput) || !/^\d+$/.test(shiftInput)) {
             throw new Error("Inputs must be positive integers.");
          }

          resultROL = circularLeftShift(numberInput, shiftInput, bitWidth);
          resultROR = circularRightShift(numberInput, shiftInput, bitWidth);

      } catch (e) {
          error = e.message;
      }
  }

    $: if (autoUpdate && (numberInput) && shiftInput) {
      calculate();}

    const cbsLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Circular_shift"},
      {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/bitwise-operators-in-c-cpp/#circular-shift"}
    ];

</script>

<ToolCard title="Circular Bit Shift">
  
  <div class="controls-grid">
      <div class="control-item main-input">
        <Input 
            label="Number (Decimal):" 
            bind:value={numberInput} 
            placeholder="e.g. 12345" 
            type="number"
            min="0"
        />
      </div>
      
      <div class="control-item">
        <Input 
            label="Shift Amount:" 
            bind:value={shiftInput} 
            placeholder="e.g. 4" 
            type="number"
            min="0"
        />
      </div>

      <div class="control-item">
        <Select 
            label="Bit Width:" 
            bind:value={bitWidthStr} 
            options={bitWidthOptions} 
        />
      </div>
  </div>

  <div class="button-row">
    <Button on:click={calculate}>Calculate Rotations</Button>
    <Button variant="secondary" on:click={() => { 
        numberInput=""; shiftInput=""; resultROL=null; resultROR=null; 
    }}>Clear</Button>

    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if resultROL && resultROR}
    <div class="results-area">
        
        <div class="result-box">
            <h4>Circular Left Shift (ROL)</h4>
            <div class="res-row">
                <span class="label">Decimal:</span> 
                <Input value={resultROL.decimal} readonly={true} withCopy={true} />
            </div>
            <div class="res-row">
                <span class="label">Binary:</span>
                <Input value={resultROL.binary} readonly={true} withCopy={true} font="monospace" />
            </div>
        </div>

        <div class="result-box">
            <h4>Circular Right Shift (ROR)</h4>
            <div class="res-row">
                <span class="label">Decimal:</span>
                <Input value={resultROR.decimal} readonly={true} withCopy={true} />
            </div>
            <div class="res-row">
                <span class="label">Binary:</span>
                <Input value={resultROR.binary} readonly={true} withCopy={true} font="monospace" />
            </div>
        </div>

    </div>
  {/if}

</ToolCard>

<Info title="About Circular Bit Shift" links={cbsLinks}>
  <p>A <b>circular bit shift</b> (also called a cyclic shift or rotation) is a bitwise operation where the bits of a binary number are 
  shifted in a circular manner, meaning that bits that are shifted out of one end are placed back at the opposite end. This differs from the 
  regular bit shift operation where bits shifted out of one end are discarded.</p>

  <p><strong>Types of Circular Bit Shifts:</strong></p>
  <ul>
  <li><strong>Circular Left Shift (ROL):</strong> In a circular left shift, the bits are shifted to the left, and the bits that 
  are shifted out from the leftmost position are wrapped around and placed at the rightmost positions. For example, a 3-bit circular left 
  shift of `101` becomes `011`.</li>
  <li><strong>Circular Right Shift (ROR):</strong> In a circular right shift, the bits are shifted to the right, and the bits that 
  are shifted out from the rightmost position are wrapped around and placed at the leftmost positions. For example, a 3-bit circular right 
  shift of `101` becomes `110`.</li>
  </ul>
  <p>Circular bit shifts are commonly used in cryptography, computer graphics, and low-level programming due to their ability to provide 
  deterministic and reversible bitwise operations that can be useful for tasks like hash functions, encryption algorithms, and pseudorandom number 
  generation.</p>
</Info>

<style>
  .controls-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
  }

  .res-row .label {
      font-weight: bold;
      color: #64748b;
      width: 70px;
      font-size: 0.9rem;
      margin-top: 0.5rem;
  }

  @media (max-width: 700px) {
      .controls-grid { grid-template-columns: 1fr; }
      .res-row { flex-direction: column; align-items: flex-start; gap: 0.2rem; }
      .res-row .label { width: auto; }
  }
</style>