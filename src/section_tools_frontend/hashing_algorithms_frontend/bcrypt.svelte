<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Info from '../../components/Info.svelte';
  import { processBcrypt } from '../../section_tools_js/hashing_algorithms_js/bcrypt.js';

  let password = "";
  let results = null;
  let error = "";
  let isLoading = false;

  // async - await
  async function generateHash() {
    error = "";
    results = null;
    isLoading = true;

    try {
      results = await processBcrypt(password);
    } catch (err) {
      console.error(err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  const bcryptLinks = [
    { text: "Bcrypt - Wikipedia", url: "https://en.wikipedia.org/wiki/Bcrypt" },
    { text: "NPM Package", url: "https://www.npmjs.com/package/bcryptjs" }
  ];
</script>

<ToolCard title="Bcrypt Hash Generator">
  
  <Input 
    label="Enter password:" 
    bind:value={password} 
    type="password"
    placeholder="e.g SecretPass123"
    expandable={false}
  />

  <div class="button-row">
    <Button on:click={generateHash}>Generate Hash</Button>
    <Button variant="secondary" on:click={() => {password = ""; results = null;}}>Clear</Button>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if results}
    <Input 
      label="Hex digest:" 
      value={results.hex} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
    <Input 
      label="Base64 digest:" 
      value={results.base64} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
    <Input 
      label="Raw digest:" 
      value={results.raw} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
    />
  {/if}

</ToolCard>

<Info title="About Bcrypt" links={bcryptLinks}>
  <p>
    This tool allows you to securely hash passwords using the <b>Bcrypt</b> algorithm. 
    Simply enter a password and click to generate the hash.
  </p>
  <p><b>What is Bcrypt?</b></p>
  <p>
    Bcrypt is a password hashing function designed for security. It incorporates automatic <b>salting</b> 
    and an adjustable cost factor, making it resistant to brute-force attacks.
  </p>
  <p>
    Unlike traditional hashing methods, Bcrypt is deliberately slow, ensuring better protection against 
    modern computing power. Your passwords are automatically salted for enhanced security.
  </p>
</Info>
