<script>
  import Info from '../../components/Info.svelte';
  import { onMount } from 'svelte';
  
  import hljs from 'highlight.js/lib/core';
  
  import python from 'highlight.js/lib/languages/python';
  
  import 'highlight.js/styles/atom-one-dark.css';

  hljs.registerLanguage('python', python);

  onMount(() => {
    hljs.highlightAll();
  });

  let bfAttackLinks = [
    { text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Brute-force_attack" },
    {text: "Cybernews", url: "https://cybernews.com/security/what-is-a-brute-force-attack/"},
  ];
</script>

<Info title="About Brute Force Attack" links={bfAttackLinks}>
    <p>
        This attack involves trying every possible key until the correct one is found. 
        While this attack is simple to implement, it can be time-consuming and computationally expensive, 
        especially for longer keys. I implemented a simple Python code simulating a brute force attack:
    </p>

    <pre><code class="language-python" style="border-radius: 8px;">
import itertools, string

target_password = "abc"
characters = string.ascii_lowercase

def brute_force_attack():
    # Trying passwords of length 1 to 4
    for length in range(1, 5):
        for guess in itertools.product(characters, repeat=length):
            guess = "".join(guess)
            
            print(f"Trying: &#123;guess&#125;") 
            
            if guess == target_password:
                print(f"Password found: &#123;guess&#125;")
                return

    print("Password not found.")

brute_force_attack()
    </code></pre>
</Info>

<style>
    pre {
        margin-top: 1rem;
        background: #282c34;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
    }
</style>