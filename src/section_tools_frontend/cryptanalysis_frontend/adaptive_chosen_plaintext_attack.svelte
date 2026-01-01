<script>
    import Info from '../../components/Info.svelte';

    const acpaLinks = [
        {text: "Stackexchange", 
        url: "https://crypto.stackexchange.com/questions/24791/what-is-the-difference-between-chosen-plaintext-attack-and-adaptive-chosen-plain"}
    ];
</script>

<Info title="About Adaptive Chosen-Plaintext Attack" links={acpaLinks}>

    This attack is similar to Chosen-Plaintext Attack (CPA) 
    but more powerful. Here, the attacker requests the cipher texts of 
    additional plaintexts after they have ciphertexts for some texts. <br><br>


</Info>