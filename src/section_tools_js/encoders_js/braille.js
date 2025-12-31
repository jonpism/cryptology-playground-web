// Braille Mapping
const TEXT_TO_BRAILLE = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
    'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
    'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
    'z': '⠵',
    ' ': '⠀',
    ',': '⠂', ';': '⠆', ':': '⠒', '.': '⠲', '!': '⠖',
    '(': '⠦', ')': '⠴', '?': '⠦', '"': '⠶', "'": '⠄',
    '-': '⠤',
    '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢',
    '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔', '0': '⠴'
};

const BRAILLE_TO_TEXT = Object.entries(TEXT_TO_BRAILLE).reduce((acc, [char, braille]) => {
    acc[braille] = char;
    return acc;
}, {});

/**
 * converts text to Braille and vice versa.
 * @param {string} input - input string.
 * @param {string} mode - 'text2braille' or 'braille2text'.
 */
export function processBraille(input, mode) {
    if (!input) return "";

    if (mode === 'text2braille') {
        return textToBraille(input);
    } else {
        return brailleToText(input);
    }
}

function textToBraille(text) {
    return Array.from(text.toLowerCase()).map(char => {
        return TEXT_TO_BRAILLE[char] || char;
    }).join("");
}

function brailleToText(brailleStr) {
    return Array.from(brailleStr).map(char => {
        return BRAILLE_TO_TEXT[char] || char;
    }).join("");
}