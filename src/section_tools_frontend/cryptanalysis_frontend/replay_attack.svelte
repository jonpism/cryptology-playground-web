<script>
    import Info from '../../components/Info.svelte';

    const replayLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Replay_attack"},
    {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/replay-attack/"},
    {text: "Cyber Security for me", url: "https://cybersecurityforme.com/replay-attack/"}
    ];
</script>

<Info title="About Replay Attack" links={replayLinks}>

    A <b>replay attack</b> is a type of network attack where an attacker intercepts 
    and retransmits valid data (such as authentication tokens or encrypted messages) to gain 
    unauthorized access or disrupt communication. Since the attacker does not need to decrypt 
    or modify the intercepted data, replay attacks can be effective even against encrypted 
    communication. Steps of how this attack works: 
    <ol>
    <li>The attacker <b>eavesdrops</b> on a legitimate communication between a user and a server.</li>
    <li>They <b>capture a valid request or authentication message</b> (e.g., login credentials, 
    digital signatures, session tokens, hashed passwords).</li>
    <li>The attacker <b>replays</b> this captured message to trick the system into granting access or 
    performing an unintended action.</li>
    </ol>

</Info>