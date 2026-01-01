<script>
    import Info from '../../components/Info.svelte';

    const saLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Slide_attack"},
    {text: "Springer", url: "https://link.springer.com/chapter/10.1007/3-540-48519-8_18"},
    {text: "Cryptology ePrint Archive", url: "https://eprint.iacr.org/2016/1177.pdf"}
    ];
</script>

<Info title="About Slide Attack" links={saLinks}>

    A <b>slide attack</b> is a cryptographic technique used to analyze the key schedule 
    of a block cipher and exploit weaknesses to break the cipher. The attack exploits the similarity 
    between different rounds of encryption. The slide attack gets its name from the way it exploits 
    the repeated structure of a block cipher to 'slide' one encryption step over another. It works 
    by finding pairs of inputs (P,P′) and outputs (C,C′) that are related in a way that 
    'slides' one round into the next. Imagine you have a deck of cards with the same sequence of
    suits repeating every few cards. If you take two cards at different points in the deck and 
    'slide' one over the other, you might see that the same pattern emerges, helping you predict 
    what comes next. The slide attack works in a similar way, but with encryption rounds instead of cards.

</Info>