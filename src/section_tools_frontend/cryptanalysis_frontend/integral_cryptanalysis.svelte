<script>
    import Info from '../../components/Info.svelte';

    const integralLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Integral_cryptanalysis"},
    {text: "SpringerLink", url: "https://link.springer.com/chapter/10.1007/3-540-45661-9_9"},
    {text: "The International Association for Cryptologic Research", url: "https://iacr.org/submit/files/slides/2024/asiacrypt/asiacrypt2024/145/145_slides.pdf"}
    ];
</script>

<Info title="About Integral Cryptanalysis" links={integralLinks}>

    Integral cryptanalysis is a cryptanalytic attack used in the cryptanalysis of 
    block ciphers, particularly those based on substitution-permutation networks (SPNs). 
    It was first introduced by Lars Knudsen and is considered an extension of differential cryptanalysis. <br><br>

</Info>