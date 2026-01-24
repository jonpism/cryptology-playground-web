<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Info from '../../components/Info.svelte';

  import { mod } from '../../section_tools_js/other_tools_js/mod_calc.js';

  let varA = "";
  let varB = "";
  let result = "";
  let error = "";

  $: calculate(varA, varB);

  function calculate(a, b) {
    // reset
    error = "";
    result = "";

    // check if inputs are empty
    if (a === "" || b === "") return;

    // check if inputs are numbers
    // allow negative numbers: ^-?\d+$
    if (!/^-?\d+$/.test(a) || !/^-?\d+$/.test(b)) {
        error = "Please enter valid integers.";
        return;
    }

    try {
        const valA = BigInt(a);
        const valB = BigInt(b);

        if (valB === 0n) {
            error = "Modulus cannot be zero.";
            return;
        }

        // calculate
        const res = mod(valA, valB);
        result = res.toString();

    } catch (e) {
        error = e.message;
    }
  }

  const modLinks = [
      { text: "Modular Arithmetic - Wikipedia", url: "https://en.wikipedia.org/wiki/Modular_arithmetic" },
      { text: "Khan Academy - Modular Arithmetic", url: "https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic/a/what-is-modular-arithmetic" }
  ];
</script>

<ToolCard title="Mod Calculator">
    
    <div class="calc-container">
        <div class="inputs-row">
            <div class="input-group">
                <label for="varA">Number (A)</label>
                <input 
                    id="varA" 
                    type="number" 
                    bind:value={varA}
                    class="calc-input"
                />
            </div>

            <div class="operator">
                %
            </div>

            <div class="input-group">
                <label for="varB">Modulus (B)</label>
                <input 
                    id="varB" 
                    type="number" 
                    bind:value={varB}
                    class="calc-input"
                />
            </div>
        </div>

        {#if error}
            <div class="msg error">{error}</div>
        {/if}

        {#if result !== ""}
            <div class="result-box">
                <span class="label">Result:</span>
                <span class="value">{result}</span>
            </div>
        {/if}
    </div>

</ToolCard>

<Info title="About Modulo" links={modLinks}>
    <p>
        <b>Modular Arithmetic</b> is a system of arithmetic for integers, where numbers "wrap around" when reaching a certain value, called the <b>modulus</b>.
    </p>
    <p>
        The operation <code>A % B</code> finds the remainder when A is divided by B.
    </p>
    <ul>
        <li>Example: <code>10 % 3 = 1</code> (because 10 divided by 3 is 3 with a remainder of 1).</li>
        <li>Example: <code>15 % 5 = 0</code> (15 divides perfectly by 5).</li>
    </ul>
    <p>
        In cryptography, we treat negative numbers carefully. This tool calculates <code>-5 % 4 = 3</code> whereas standard calculators might return -1.
    </p>
</Info>

<style>
    .calc-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
        padding: 1rem 0;
    }

    .inputs-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-weight: bold;
        color: #334155;
        font-size: 0.9rem;
    }

    .calc-input {
        padding: 0.8rem;
        border: 2px solid #cbd5e1;
        border-radius: 8px;
        font-size: 1.2rem;
        width: 150px;
        text-align: center;
        font-family: monospace;
    }
    
    .calc-input:focus {
        outline: none;
        border-color: #3b82f6;
    }

    .operator {
        font-size: 2rem;
        font-weight: bold;
        color: #64748b;
        margin-top: 1.5rem;
    }

    .result-box {
        background: #eff6ff;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 150px;
    }

    .result-box .label {
        font-size: 0.85rem;
        color: #60a5fa;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
        margin-bottom: 0.2rem;
    }

    .result-box .value {
        font-size: 2rem;
        font-weight: bold;
        color: #1e3a8a;
        font-family: monospace;
    }

    .msg.error {
        color: #dc2626;
        background: #fee2e2;
        padding: 0.8rem;
        border-radius: 6px;
        font-weight: bold;
    }
</style>