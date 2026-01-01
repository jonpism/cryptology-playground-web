<script>
    import Info from '../../components/Info.svelte';

    const boomerangAttackLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Boomerang_attack"},
        {text: "SpringerLink", url: "https://link.springer.com/chapter/10.1007/3-540-48519-8_12"},
        {text: "Cryptology ePrint Archive", url: "https://eprint.iacr.org/2019/1154.pdf"}
    ];
</script>

<Info title="About Boomerang Attack" links={boomerangAttackLinks}>

    A Boomerang Attack is a cryptanalysis technique used to attack block ciphers. 
    The boomerang attack is based on <a href='https://en.wikipedia.org/wiki/Differential_cryptanalysis'>differential cryptanalysis</a> 
    (basically an extension of differential cryptanalysis). The attack was published in 1999 by <a href='https://en.wikipedia.org/wiki/David_A._Wagner'>David Wagner</a>, 
    who used it to break the COCONUT98 cipher. <br><br>

</Info>