<script>
    import Info from '../../components/Info.svelte';

    const cpaLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Chosen-plaintext_attack"},
    {text: "Baeldung", url: "https://www.baeldung.com/cs/cryptography-known-plaintext-attack-vs-chosen-plaintext-attack"},
    {text: "NordVPN", url: "https://nordvpn.com/cybersecurity/glossary/chosen-plaintext-attack/"}
    ];
</script>

<Info title="About Chosen-Plaintext Analysis" links={cpaLinks}>

    In this type of attack the attacker can choose arbitrary plaintexts and obtain their corresponding 
    ciphertexts. This capability allows the attacker to analyze how the encryption algorithm processes different inputs 
    , potentially revealing weaknesses in the encryption scheme. Its very simple to implement like 
    <a href='https://cointelegraph.com/explained/known-plaintext-attacks-explained'>KPA</a> but the success rate 
    is quite low. The attacker has the ability to select plaintexts and observe their encrypted outputs. Information about the 
    encryption key and the structure of the encryption algorithm can be uncovered. <br><br>
    <b>Example: Chosen-Plaintext attack on Caesar Cipher</b> <br>
    Let's say Eve (the attacker) suspects a system is using Caesar Cipher for encryption. Eve can input plaintext messages and 
    observe their encrypted versions. She selects the plaintext: ABCDEFGHIJKLMNOPQRSTUVWXYZ and then the system encrypts this 
    plaintext and returns the output: CIPHERTEXT:  DEFGHIJKLMNOPQRSTUVWXYZABC. <br>
    Eve then analyzes the output by comparing the plaintext to the ciphertext and she deduces the shift: A->D, B->E, C->F, etc.
    Since the shift is consistent for every letter, Eve determines that the encryption uses a Caesar cipher with a shift of 3. <br><br>

</Info>