<script>
  // COMPONENTS
  import Sidebar from './components/Sidebar.svelte';
  import Home from './section_tools_frontend/HomePage.svelte';
  import Terminal from './components/Terminal.svelte';

  // ASYMMETRIC ENCRYPTION TOOLS
  import CERT_SIGNING_REQUEST from './section_tools_frontend/asymmetric_encryption_frontend/cert_signing_request.svelte';
  import DIFFIE_HELLMAN from './section_tools_frontend/asymmetric_encryption_frontend/diffie_hellman.svelte';
  import ECDSA from './section_tools_frontend/asymmetric_encryption_frontend/ecdsa.svelte';
  import ECDSA_KEY_PAIR_GEN from './section_tools_frontend/asymmetric_encryption_frontend/ecdsa_key_pair_gen.svelte';
  import RSA from './section_tools_frontend/asymmetric_encryption_frontend/rsa.svelte';
  import RSA_KEY_PAIR_GEN from './section_tools_frontend/asymmetric_encryption_frontend/rsa_key_pair_gen.svelte';
  import X509_SELF_SIGNED_CERT from './section_tools_frontend/asymmetric_encryption_frontend/x509_self_signed.svelte';

  // SYMMETRIC ENCRYPTION TOOLS
  import AES from './section_tools_frontend/symmetric_encryption_frontend/aes.svelte';
  import DES from './section_tools_frontend/symmetric_encryption_frontend/des.svelte';
  import TRIPLE_DES from './section_tools_frontend/symmetric_encryption_frontend/triple_des.svelte';

  // CIPHERS
  import CAESAR_CIPHER from './section_tools_frontend/ciphers_frontend/caesar_cipher.svelte';
  import AFFINE_CIPHER from './section_tools_frontend/ciphers_frontend/affine_cipher.svelte';
  import BACON_CIPHER from './section_tools_frontend/ciphers_frontend/bacon_cipher.svelte';
  import BIFID_CIPHER from './section_tools_frontend/ciphers_frontend/bifid_cipher.svelte';
  import CHACHA from './section_tools_frontend/ciphers_frontend/chacha.svelte';

  // FILE HANDLING TOOLS
  import ZipWithPwdTool from './section_tools_frontend/file_handling_frontend/zip_with_password.svelte';
  import FILE_HASH_GENERATOR from './section_tools_frontend/file_handling_frontend/file_hash_generator.svelte';
  import FILE_TYPE_DETECTOR from './section_tools_frontend/file_handling_frontend/file_type_detector.svelte';
  import LOG_ANALYZER from './section_tools_frontend/file_handling_frontend/log_analyzer.svelte';

  // CONVERTERS TOOLS
  import BINARY_CONVERTER from './section_tools_frontend/converters_frontend/binary_converter.svelte';
  import ASCII_CONVERTER from './section_tools_frontend/converters_frontend/ascii_converter.svelte';
  import DECIMAL_BINARY from './section_tools_frontend/converters_frontend/decimal_binary.svelte';
  import OCTAL_CONVERTER from './section_tools_frontend/converters_frontend/octal_converter.svelte';
  import HEX_CONVERTER from './section_tools_frontend/converters_frontend/hex_converter.svelte';
  import CODEPOINT_CONVERTER from './section_tools_frontend/converters_frontend/codepoint_converter.svelte';
  import DECIMAL_RADIX from './section_tools_frontend/converters_frontend/decimal_radix.svelte';
  import DECIMAL_BCD from './section_tools_frontend/converters_frontend/decimal_bcd.svelte';
  import CHAR_HTML_ENTITY from './section_tools_frontend/converters_frontend/char_htmlEntity.svelte';
  import PEM_DER_CONVERTER from './section_tools_frontend/converters_frontend/pem_der_converter.svelte';
  import UNIX_TIME_CONVERTER from './section_tools_frontend/converters_frontend/unix_time_converter.svelte';
  import NATO_PHONETIC_CONVERTER from './section_tools_frontend/converters_frontend/nato_phonetic.svelte';
  import HEXDUMP_CONVERTER from './section_tools_frontend/converters_frontend/hexdump_converter.svelte';
  import CSV_JSON_CONVERTER from './section_tools_frontend/converters_frontend/csv_json.svelte';

  // ENCODERS TOOLS
  import A1Z26_ENCODER from './section_tools_frontend/encoders_frontend/a1z26Encoder.svelte';
  import BRAILLE from './section_tools_frontend/encoders_frontend/braille.svelte';
  import BASE_ENCODER from './section_tools_frontend/encoders_frontend/base_encoder.svelte';
  import MORSE_CODE from './section_tools_frontend/encoders_frontend/morse_code.svelte';
  import PUNYCODE from './section_tools_frontend/encoders_frontend/punycode.svelte';
  import QUOTED_PRINTABLE from './section_tools_frontend/encoders_frontend/quoted_printable.svelte';
  import URL_ENCODER from './section_tools_frontend/encoders_frontend/url_encoder.svelte';
  import UTF_ENCODING from './section_tools_frontend/encoders_frontend/utf_encoding.svelte';

  // HASHING ALGORITHMS TOOLS
  import SHA2_FAMILY from './section_tools_frontend/hashing_algorithms_frontend/sha2_family.svelte';
  import SHA3_FAMILY from './section_tools_frontend/hashing_algorithms_frontend/sha3_family.svelte';
  import HASHIDENTIFIER from './section_tools_frontend/hashing_algorithms_frontend/hash_identifier.svelte';
  import BCRYPT from './section_tools_frontend/hashing_algorithms_frontend/bcrypt.svelte';
  import BLAKE from './section_tools_frontend/hashing_algorithms_frontend/blake_hash.svelte';
  import CRC from './section_tools_frontend/hashing_algorithms_frontend/crc_hash.svelte';
  import MESSAGE_DIGEST from './section_tools_frontend/hashing_algorithms_frontend/message_digest.svelte';
  import RIPEMD160 from './section_tools_frontend/hashing_algorithms_frontend/ripemd160.svelte';
  import KECCAK from './section_tools_frontend/hashing_algorithms_frontend/keccak.svelte';
  import WHIRLPOOL from './section_tools_frontend/hashing_algorithms_frontend/whirlpool_hash.svelte';
  import SHAKE from './section_tools_frontend/hashing_algorithms_frontend/shake_hash.svelte';
  import cSHAKE from './section_tools_frontend/hashing_algorithms_frontend/cshake_hash.svelte';

  // CRYPTANALYSIS
  import RSA_WIENER_ATTACK from './section_tools_frontend/cryptanalysis_frontend/rsa_wiener_attack.svelte';

  // OTHER TOOLS
  import HMAC from './section_tools_frontend/other_tools_frontend/hmac.svelte';
  import FREQUENCY_ANALYSIS from './section_tools_frontend/other_tools_frontend/frequency_analysis.svelte';
  import PRIME_NUMBER_GENERATOR from './section_tools_frontend/other_tools_frontend/prime_number_generator.svelte';
  import PRNG from './section_tools_frontend/other_tools_frontend/prng.svelte';
  import RANDOMNESS_TESTER from './section_tools_frontend/other_tools_frontend/randomness_tester.svelte';
  import CIRCULAR_BIT_SHIFT from './section_tools_frontend/other_tools_frontend/circular_bit_shift.svelte';
  import DATA_COMPRESSION from './section_tools_frontend/other_tools_frontend/data_compression.svelte';
  import DATA_DIFFERENCING from './section_tools_frontend/other_tools_frontend/data_differencing.svelte';
  import ENTROPY from './section_tools_frontend/other_tools_frontend/entropy.svelte';
  import INT_FACTORIZATION from './section_tools_frontend/other_tools_frontend/int_factorization.svelte';
  import XOR_OPERATION from './section_tools_frontend/other_tools_frontend/xor_operation.svelte';
  import COMPARE_HASHES from './section_tools_frontend/file_handling_frontend/compare_hashes.svelte';

  let menuStructure = [
    {
      category: "Asymmetric Encryption",
      icon: "",
      expanded: false,
      items: [
        { name: "Certificate Signing Request (CSR)", component: CERT_SIGNING_REQUEST },
        { name: "Diffie Hellman Key Exchange", component: DIFFIE_HELLMAN },
        { name: "Elliptic Curve DSA (ECDSA)", component: ECDSA },
        { name: "Generate ECDSA Key Pair", component: ECDSA_KEY_PAIR_GEN },
        { name: "RSA", component: RSA },
        { name: "Generate RSA Key Pair", component: RSA_KEY_PAIR_GEN },
        { name: "X.509 Self-Signed Certificate", component: X509_SELF_SIGNED_CERT }
      ]
    },
    {
      category: "Symmetric Encryption",
      icon: "",
      expanded: false,
      items: [
        { name: "AES", component: AES },
        { name: "DES", component: DES },
        { name: "Triple DES", component: TRIPLE_DES },
      ]
    },
    {
      category: "Ciphers",
      icon: "",
      expanded: false,
      items: [
        { name: "Affine Cipher", component: AFFINE_CIPHER },
        { name: "Caesar Cipher", component: CAESAR_CIPHER },
        { name: "Bacon Cipher", component: BACON_CIPHER },
        { name: "Bifid Cipher", component: BIFID_CIPHER },
        { name: "ChaCha20", component: CHACHA },
      ]
    },
    {
      category: "Converters",
      icon: "",
      expanded: false,
      items: [
        { name: "Binary", component: BINARY_CONVERTER },
        { name: "ASCII", component: ASCII_CONVERTER },
        { name: "Decimal/Binary Converter", component: DECIMAL_BINARY },
        { name: "Octal Converter", component: OCTAL_CONVERTER },
        { name: "Hex Converter", component: HEX_CONVERTER },
        { name: "Codepoint Converter", component: CODEPOINT_CONVERTER },
        { name: "Decimal/Radix (Base) Converter", component: DECIMAL_RADIX },
        { name: "Decimal/BCD (Binary coded decimal)", component: DECIMAL_BCD },
        { name: "Char to HTML Entity", component: CHAR_HTML_ENTITY },
        { name: "PEM to DER (Hex)", component: PEM_DER_CONVERTER },
        { name: "Unix Time Converter", component: UNIX_TIME_CONVERTER },
        { name: "Nato Phonetic Alphabet", component: NATO_PHONETIC_CONVERTER },
        { name: "Hexdump Converter", component: HEXDUMP_CONVERTER },
        { name: "CSV / JSON Converter", component: CSV_JSON_CONVERTER },
      ]
    },
    {
      category: "Encoders",
      icon: "",
      expanded: false,
      items: [
        { name: "A1Z26", component: A1Z26_ENCODER },
        { name: "Braille", component: BRAILLE },
        { name: "Base Encoder/Decoder", component: BASE_ENCODER },
        { name: "Morse Code", component: MORSE_CODE },
        { name: "Punycode", component: PUNYCODE },
        { name: "Quoted Printable", component: QUOTED_PRINTABLE },
        { name: "URL Encoder", component: URL_ENCODER },
        { name: "UTF Encoding", component: UTF_ENCODING },
        
      ]
    },
    {
      category: "File Handling Tools",
      icon: "",
      expanded: false,
      items: [
        { name: "Zip Encryptor", component: ZipWithPwdTool },
        { name: "File Hash Generator", component: FILE_HASH_GENERATOR },
        { name: "Compare File Hashes", component: COMPARE_HASHES },
        { name: "File Type Detector", component: FILE_TYPE_DETECTOR },
        { name: "Log File Analyzer", component: LOG_ANALYZER },
      ]
    },
    {
      category: "Hashing Algorithms",
      icon: "",
      expanded: false,
      items: [
        { name: "SHA2-family", component: SHA2_FAMILY },
        { name: "SHA3-family", component: SHA3_FAMILY },
        { name: "Hash Identifier", component: HASHIDENTIFIER },
        { name: "Bcrypt Hash Generator", component: BCRYPT },
        { name: "BLAKE", component: BLAKE },
        { name: "CRC", component: CRC },
        { name: "Message Digest", component: MESSAGE_DIGEST },
        { name: "RIPEMD-160", component: RIPEMD160 },
        { name: "Keccak", component: KECCAK },
        { name: "Whirlpool", component: WHIRLPOOL },
        { name: "SHAKE", component: SHAKE },
        { name: "cSHAKE", component: cSHAKE }
]
    },
    {
      category: "Cryptanalysis",
      icon: "",
      expanded: false,
      items: [
        { name: "RSA Wiener Attack", component: RSA_WIENER_ATTACK },
        { name: "Differential Analysis", component: null },
        { name: "Linear Cryptanalysis", component: null },
        { name: "Boomerang Attack", component: null },
      ]
    },
    {
      category: "Other Tools",
      icon: "",
      expanded: false,
      items: [
        { name: "HMAC", component: HMAC },
        { name: "Frequency Analysis", component: FREQUENCY_ANALYSIS },
        { name: "Prime Number Generator", component: PRIME_NUMBER_GENERATOR },
        { name: "Pseudo-Random Number Generator", component: PRNG },
        { name: "Randomness Tester", component: RANDOMNESS_TESTER },
        { name: "Circular Bit Shift", component: CIRCULAR_BIT_SHIFT },
        { name: "Data compression", component: DATA_COMPRESSION },
        { name: "Data differencing", component: DATA_DIFFERENCING },
        { name: "Entropy", component: ENTROPY },
        { name: "Integer Factorization", component: INT_FACTORIZATION },
        { name: "XOR operation", component: XOR_OPERATION },
      ]
    }
  ];

  let activeTool = 'home'; 
  let showTerminal = false;

  function handleOpenTerminal() {
    showTerminal = true;
    activeTool = null; // deselect current tool visually
  }

  function handleCloseTerminal() {
    showTerminal = false;
  }

  function handleSelect(event) {
    showTerminal = false;
    activeTool = event.detail;
  }

  function handleToggle(event) {
    const index = event.detail;
    menuStructure[index].expanded = !menuStructure[index].expanded;
  }

  function handleGoHome() {
    showTerminal = false;
    activeTool = 'home';
  }

  function handleTerminalNavigation(event) {
    const toolName = event.detail;

    let foundTool = null;
    
    // loop through categories
    for (const section of menuStructure) {
      const match = section.items.find(item => 
        item.name.toLowerCase().includes(toolName)
      );
      if (match) {
        foundTool = match;
        break;
      }
    }

    if (foundTool) {
      activeTool = foundTool;
      showTerminal = false; // close terminal automatically
    } else {
      console.log("Tool not found via terminal");
    }
  }
</script>

<div class="app-container">
  
  <Sidebar 
    {menuStructure} 
    {activeTool}
    on:select={handleSelect}
    on:toggle={handleToggle}
    on:home={handleGoHome}
    on:openTerminal={handleOpenTerminal}
  />

  {#if showTerminal}
      <Terminal 
      on:close={handleCloseTerminal}
      on:requestNavigation={handleTerminalNavigation} />
  {:else}
  <main class="content">
    {#if activeTool === 'home'}
      <Home />
    {:else if activeTool && activeTool.component}
      <svelte:component this={activeTool.component} />
    {:else}
      <div class="placeholder">
        <h3>Work in Progress</h3>
        <p>The tool <strong>{activeTool.name}</strong> has not been created yet.</p>
        <p class="sub-text">Check back later for updates!</p>
      </div>
    {/if}
  </main>
  {/if}

</div>

<style>
  
  :global(body) { 
    margin: 0; 
    padding: 0; 
    font-family: 'Segoe UI', system-ui, sans-serif; 
    background-color: #f1f5f9;
  }

  .app-container { 
    display: flex; 
    height: 100vh; 
    width: 100vw; 
    overflow: hidden; 
  }

  .content {
    flex-grow: 1;
    background-color: #bed8ee;
    padding: 2rem;
    overflow-y: auto;
  }
  
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #64748b;
    border: 3px dashed #cbd5e1;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .placeholder h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #475569;
  }

  .sub-text {
    font-size: 0.9rem;
    color: #94a3b8;
  }
</style>