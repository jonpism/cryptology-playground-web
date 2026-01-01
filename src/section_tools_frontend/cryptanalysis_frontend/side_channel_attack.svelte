<script>
    import Info from '../../components/Info.svelte';

    const rhcLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Side-channel_attack"},
    {text: "All about circuits", url: "https://www.allaboutcircuits.com/technical-articles/understanding-side-channel-attack-basics/"}
    ];
</script>

<Info title="About Side-Channel Attack" links={rhcLinks}>

    This type of attack is based on information obtained from the physical 
    implementation of the cryptographic system, rather than on weaknesses in the algorithm 
    itself. Side-channel attacks include timing attacks, power analysis attacks, electromagnetic 
    attacks, and others. In other words, it can exploit unintended information leakage from a 
    system rather than breaking cryptographic algorithms directly. These attacks take advantage of 
    physical characteristics or indirect outputs.

</Info>