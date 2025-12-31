export const ENCODING_OPTIONS = [
    // Modern
    { value: "utf-8", label: "UTF-8 (Default)" },
    { value: "utf-16le", label: "UTF-16LE (Little Endian)" },
    { value: "utf-16be", label: "UTF-16BE (Big Endian)" },
    { value: "hex", label: "Hex String" },
    { value: "base64", label: "Base64" },
    
    // Windows Family
    { value: "windows-1250", label: "Windows-1250 (Central Eur)" },
    { value: "windows-1251", label: "Windows-1251 (Cyrillic)" },
    { value: "windows-1252", label: "Windows-1252 (Western)" },
    { value: "windows-1253", label: "Windows-1253 (Greek)" },
    { value: "windows-1254", label: "Windows-1254 (Turkish)" },
    { value: "windows-1255", label: "Windows-1255 (Hebrew)" },
    { value: "windows-1256", label: "Windows-1256 (Arabic)" },
    { value: "windows-1257", label: "Windows-1257 (Baltic)" },
    { value: "windows-1258", label: "Windows-1258 (Vietnamese)" },
    { value: "windows-874",  label: "Windows-874 (Thai)" },

    // ISO-8859 Family
    { value: "iso-8859-2", label: "ISO-8859-2 (Latin-2)" },
    { value: "iso-8859-3", label: "ISO-8859-3 (Latin-3)" },
    { value: "iso-8859-4", label: "ISO-8859-4 (Latin-4)" },
    { value: "iso-8859-5", label: "ISO-8859-5 (Cyrillic)" },
    { value: "iso-8859-6", label: "ISO-8859-6 (Arabic)" },
    { value: "iso-8859-7", label: "ISO-8859-7 (Greek)" },
    { value: "iso-8859-8", label: "ISO-8859-8 (Hebrew)" },
    { value: "iso-8859-10", label: "ISO-8859-10 (Latin-6)" },
    { value: "iso-8859-13", label: "ISO-8859-13 (Latin-7)" },
    { value: "iso-8859-14", label: "ISO-8859-14 (Celtic)" },
    { value: "iso-8859-15", label: "ISO-8859-15 (Latin-9)" },
    { value: "iso-8859-16", label: "ISO-8859-16 (Romanian)" },

    // Asian Multi-byte
    { value: "shift_jis", label: "Shift_JIS (Japanese)" },
    { value: "windows-874", label: "Windows-874 (Thai)" },

    // Others
    { value: "ibm866", label: "IBM866 (DOS Cyrillic)" },
    { value: "koi8-r", label: "KOI8-R (Russian)" },
    { value: "koi8-u", label: "KOI8-U (Ukrainian)" },
    { value: "macintosh", label: "Macintosh (MacRoman)" },
    { value: "x-user-defined", label: "x-user-defined" }
];