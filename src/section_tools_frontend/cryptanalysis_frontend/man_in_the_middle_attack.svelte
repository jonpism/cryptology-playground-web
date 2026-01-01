<script>
    import Info from '../../components/Info.svelte';

    const mitmLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Man-in-the-middle_attack"},
    {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/man-in-the-middle-attack-in-diffie-hellman-key-exchange/"},
    {text: "Geekflare", url: "https://geekflare.com/cybersecurity/mitm-attack-tools/"},
    {text: "Computerphile - YTB video", url: "https://www.youtube.com/watch?v=-enHfpHMBo4"}
    ];
</script>

<Info title="About Man-in-the-middle Attack" links={mitmLinks}>

    In this type of attack, the attacker secretly intercepts the message/key and 
    potentially alters communication between two communicating parties (without their knowledge) 
    through a secured channel. The attacker positions themselves between the sender and receiver, 
    making it seem like a normal exchange while secretly eavesdropping or manipulating the data. 
    <ul>
    <li>The attacker intercepts communication between two parties (e.g., a user and a website, or two devices in a network).</li>
    <li>The attacker may decrypt, alter, or log the transmitted data before forwarding it to the intended recipient.</li>
    <li>The attacker can impersonate one or both parties, tricking them into thinking they are communicating directly.</li>
    </ul>
    <b>Common MITM Attack Techniques:</b>
    <ul>
    <li><b>Wi-Fi Eavesdropping:</b> Attackers set up fake public Wi-Fi networks to capture user data.</li>
    <li><b>DNS Spoofing:</b> Redirecting users to a fake website by manipulating DNS records.</li>
    <li><b>ARP Spoofing:</b> Manipulating the Address Resolution Protocol (ARP) to reroute network traffic.</li>
    </ul>

</Info>