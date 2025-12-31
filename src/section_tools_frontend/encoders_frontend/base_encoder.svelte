<script>
  import ToolCard from '../../components/ToolCard.svelte';
  import Input from '../../components/Input.svelte';
  import Button from '../../components/Button.svelte';
  import Select from '../../components/Select.svelte';
  import Info from '../../components/Info.svelte';
  import AutoUpdateButton from '../../components/AutoUpdateButton.svelte';
  import SwapButton from '../../components/SwapButton.svelte';

  import { processBaseEncoder } from '../../section_tools_js/encoders_js/base_encoder.js';
  import { ENCODING_OPTIONS } from '../../section_tools_js/helpers/inputEncodingOptions.js';

  let inputText = "";
  let mode = "encode";
  let selectedBase = "base64";
  let inputEncoding = "utf-8";
  let selectedRFC = "RFC4648";

  let result = "";
  let error = "";
  let autoUpdate = true;

  const modeOptions = [
    { value: "encode", label: "Text/Bytes to Base" },
    { value: "decode", label: "Base to Text" }
  ];

  const baseOptions = [
    { value: "base32", label: "Base32" },
    { value: "base45", label: "Base45" },
    { value: "base58", label: "Base58" },
    { value: "base62", label: "Base62" },
    { value: "base64", label: "Base64" },
    { value: "base85", label: "Base85" },
    { value: "base92", label: "Base92" }
  ];

  const rfcOptions = [
    { value: "RFC4648", label: "RFC 4648 (Standard)" },
    { value: "RFC4648-URL", label: "RFC 4648 (URL Safe)" },
    { value: "RFC2045", label: "RFC 2045 (MIME)" },
    { value: "RFC2152", label: "RFC 2152 (UTF-7)" },
    { value: "RFC3501", label: "RFC 3501 (IMAP)" }
  ];

  function runConverter() {
    if (!inputText) {
        result = "";
        error = "";
        return;
    }

    error = "";
    
    try {
      result = processBaseEncoder(inputText, selectedBase, mode, inputEncoding, selectedRFC);
    } catch (e) {
      error = e.message;
      result = "";
    }
  }

  function swapModes() {
      mode = (mode === 'encode') ? 'decode' : 'encode';
      if (result && !error) {
          inputText = result;
      }
      runConverter();
  }

  $: if (autoUpdate && (inputText || mode || selectedBase || inputEncoding || selectedRFC)) {
      runConverter();
  }

  const baseLinks = [
    { text: "Binary to Text Encoding - Wikipedia", url: "https://en.wikipedia.org/wiki/Binary-to-text_encoding" },
    { text: "Base32 - Wikipedia", url: "https://en.wikipedia.org/wiki/Base32" },
    { text: "Base62 - Wikipedia", url: "https://en.wikipedia.org/wiki/Base62" },
    { text: "Base64 - Wikipedia", url: "https://en.wikipedia.org/wiki/Base64" },
    { text: "Base85/Ascii85 - Wikipedia", url: "https://en.wikipedia.org/wiki/Ascii85" },
  ];
</script>

<ToolCard title="Universal Base Encoder">
  
  <div class="controls-row">
    <Select 
      label="Operation:" 
      bind:value={mode} 
      options={modeOptions} 
    />
    
    <Select 
      label="Encoding Standard:" 
      bind:value={selectedBase} 
      options={baseOptions} 
    />
  </div>

  <div class="controls-row" style="margin-top: 0.5rem;">
    {#if mode === 'encode'}
      <Select 
          label="Input Encoding:" 
          bind:value={inputEncoding} 
          options={ENCODING_OPTIONS.map(o => o.value)} 
      />
    {/if}

    {#if selectedBase === 'base64' && mode === 'encode'}
      <Select 
          label="RFC Format:" 
          bind:value={selectedRFC} 
          options={rfcOptions} 
      />
    {/if}
  </div>

  <Input 
    label={mode === 'encode' ? "Input Data:" : `Input ${selectedBase} string:`}
    bind:value={inputText} 
    placeholder={mode === 'encode' ? "Type here..." : "e.g. 5rWf..."} 
    expandable={true}
  />

  <div class="button-row">
    <Button on:click={runConverter}>Convert</Button>
    <Button variant="secondary" on:click={() => { inputText = ""; result = ""; }}>Clear</Button>
    <SwapButton on:click={swapModes} />
    
    <div style="margin-left: auto;">
       <AutoUpdateButton bind:checked={autoUpdate} />
    </div>
  </div>

  {#if error}
    <div class="msg error">{error}</div>
  {/if}

  {#if result}
    <Input 
      label="Result:" 
      value={result} 
      readonly={true} 
      expandable={true}
      withCopy={true} 
      rows={4}
    />
  {/if}

</ToolCard>

<Info title="About Base Encodings" links={baseLinks}>
  <p><b>BASE32</b> is a binary-to-text encoding scheme that is used to represent 
    binary data in an ASCII string format. It is designed to encode data  
    in a way that is more efficient than some other encoding methods, 
    such as BASE64, when dealing with systems that are case-insensitive or 
    when working with text that needs to avoid special characters.
    The character set used in BASE32 is: ABCDEFGHIJKLMNOPQRSTUVWXYZ234567 
    Each character in the BASE32 alphabet encodes 5 bits of binary data 
    (since 2**5 = 32). BASE32 uses the '=' character for padding to make 
    the length of the encoded output a multiple of 8 characters, ensuring 
    proper decoding.</p>

    <p><b>Base45</b> is a relatively newer binary-to-text encoding scheme compared 
    to common encoding schemes like Base64 and Base32. It has emerged with 
    specific use cases where compact data representation is needed, 
    especially in environments that may have character restrictions. 
    A notable application of Base45 is in encoding information for EU 
    Digital COVID Certificates. The Base45 character set includes the 
    following characters:0-9 (digits), A-Z (uppercase letters), and 
    space plus the characters: $%*+-./:
    Each character in the Base45 alphabet represents 45 possible values,
    which is enough to encode 2 bytes (16 bits) into 3 characters (since 
    452>256452>256, where 256 represents 8-bit data for a byte).</p>

    <p><b>Base58</b> is a binary-to-text encoding scheme designed to 
    represent large integers in a compact and human-friendly 
    way. It is used in various applications where shortened 
    representations of binary data are needed, particularly 
    in cryptocurrencies and blockchain technology. Base58 
    uses a set of 58 alphanumeric characters: 123456789ABCDE
    FGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz.
    e.g: A typical Bitcoin address might look like this: 
    1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa. This address is 
    encoded in Base58Check.</p>

    <p><b>Base62</b> is a binary-to-text encoding scheme that is often used 
    to represent large integers or binary data in a shorter and 
    more human-readable form. It is commonly used in scenarios 
    where data needs to be compact yet readable, such as URL 
    shorteners, unique identifiers for database records, and cases 
    where a high-density encoding is needed that can be transmitted 
    using alphanumeric characters. The full character set for Base62 
    looks like this: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 
    Base62 provides a compact representation. Since it uses 62 characters, 
    it can represent data more efficiently than Base10, Base16, or Base32. 
    For example, a shorter URL generated using Base62 is easier to type 
    and more visually manageable.</p>

    <p><b>Base64</b> is a binary-to-text encoding scheme that represents binary 
    data in an ASCII string format. It is commonly used to encode 
    data when transmitting it over media that are designed to handle text, 
    ensuring that the data remains intact without modification during transport. 
    Here is the full set of characters used in Base64 encoding:
    ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ 
    Base64 is not a secure way to encode data; it's simply a reversible 
    encoding mechanism. It's not intended to hide information, as anyone 
    who understands Base64 can easily decode it.</p>

    <p><b>Base85</b>, also known as Ascii85, is a binary-to-text encoding scheme 
    used to encode binary data into a string of ASCII characters. 
    This is useful when transmitting binary data over channels that are 
    designed to handle only text, such as email or certain internet protocols. 
    Base85 is more efficient than Base64. While Base64 uses 4 characters to 
    represent every 3 bytes of binary data (a 33% increase in size), Base85 
    uses 5 characters to encode every 4 bytes of binary data, resulting in 
    only a 25% increase in size. Thus, Base85 is more space-efficient.</p>

    <p><b>Base92</b> is an encoding system designed to efficiently represent 
    binary data using a subset of ASCII characters. It is similar to 
    other encoding schemes like Base64, but it optimizes for cases where 
    minimizing the output size is important. The idea behind Base 92 
    is to use a set of 92 printable ASCII characters to represent data, 
    which reduces the expansion factor compared to Base64. The character 
    set for Base 92 encoding includes printable ASCII characters, excluding 
    characters that might cause issues in text processing or when displayed. 
    Specifically, it uses a set of 92 characters selected from the printable 
    range of ASCII characters (33 to 126).</p>

</Info>