<script>
    import Info from '../../components/Info.svelte';

    const linearAnalysisLinks = [{text: "Wikipedia", url: "https://en.wikipedia.org/wiki/Linear_cryptanalysis"},
        {text: "Geeks for Geeks", url: "https://www.geeksforgeeks.org/differential-and-linear-cryptanalysis/"},
        {text: "Amazing King", url: "http://www.theamazingking.com/crypto-linear.php"}
    ];
</script>

<Info title="About Linear Cryptanalysis" links={linearAnalysisLinks}>

    <b>Linear cryptanalysis</b> is an attack method used to break block ciphers and stream ciphers. 
    Linear cryptanalysis and differential cryptanalysis are the two most widely used attacks on block ciphers. 
    Linear cryptanalysis was discovered by <a href='https://en.wikipedia.org/wiki/Mitsuru_Matsui'>Mitsuru Matsui</a> 
    in 1992 and was successfully used to attack the <a href='https://en.wikipedia.org/wiki/Data_Encryption_Standard'>Data Encryption Standard (DES)</a>. <br>
    Linear cryptanalysis exploits statistical biases in the linear approximations of the cipher’s operations. It relies
    on finding linear relationships between plaintext bits, ciphertext bits, and key bits that hold with a probability 
    significantly different from 50%. These biases allow an attacker to deduce information about the secret key after 
    analyzing a large number of plaintext-ciphertext pairs. <br><br>


</Info>