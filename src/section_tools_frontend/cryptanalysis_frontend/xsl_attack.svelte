<script>
    import Info from '../../components/Info.svelte';

    const xslaLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/XSL_attack"},
    {text: "Cryptology ePrint Archive", url: "https://eprint.iacr.org/2023/151.pdf"},
    {text: "DBpedia Association", url: "https://dbpedia.org/page/XSL_attack"}
    ];
</script>

<Info title="About eXtended Sparse Linearization Attack" links={xslaLinks}>

    The <b>eXtended Sparse Linearization (XSL) attack</b> is a theoretical method 
    designed to break certain block ciphers, including AES, by exploiting their algebraic structure. 
    It works by rewriting the encryption process as a system of quadratic equations, which, in theory, 
    could be solved to recover the secret key. 
    The idea behind XSL builds on an earlier method called eXtended Linearization (XL), which attempts 
    to solve multivariate quadratic (MQ) equations by introducing extra equations. However, XSL takes 
    this a step further by choosing equations more selectively, aiming to keep the system manageable and solvable.
    One of the main advantages of XSL (if it were practical) is that it doesn't require massive amounts of 
    plaintext-ciphertext pairs, unlike differential or linear cryptanalysis. Instead, it focuses on the 
    mathematical properties of the cipher itself. 
    That said, most cryptographers remain skeptical about its feasibility. The method relies on assumptions 
    about how many independent equations can be generated, and in practice, it seems that there aren't enough 
    to fully break AES or other ciphers. So while it's an interesting concept, it's never been successfully 
    used to crack real-world encryption.

</Info>