<script>
    import Info from '../../components/Info.svelte';

    const rtaLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Rainbow_table"},
    {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/understanding-rainbow-table-attack/"},
    {text: "CrackStation", url: "https://crackstation.net/"},
    {text: "RainbowCrack", url: "http://project-rainbowcrack.com/table.htm"}
    ];
</script>

<Info title="About Rainbow Table Attack" links={rtaLinks}>

    A <b>Rainbow Table</b> is a cryptographic attack technique used for cracking password 
    hashes efficiently. It is a precomputed table of hash values for different possible passwords, 
    allowing an attacker to quickly reverse a hash back into its original password without brute-forcing
    each possibility in real-time. 
    <ul>
    <li>A large table is generated, mapping plaintext passwords to their corresponding hash values.</li>
    <li>Instead of storing every possible hash, <b>rainbow tables use chains</b> to reduce space usage. 
    Each chain starts with an initial plaintext password, repeatedly hashed and reduced to a new plaintext until a final hash is stored.</li>
    <li>When an attacker obtains a hashed password (e.g., from a database breach), they can compare it against the table to find a match, then use the chain to recover the original password.</li>
    <li>It is faster than brute-force attacks since hashes are precomputed.</li>
    <li>It is more efficient than a direct lookup table because it uses chains to reduce storage size.</li>
    </ul>

</Info>