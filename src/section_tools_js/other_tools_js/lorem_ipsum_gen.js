// standard set of Lorem Ipsum words
const RAW_TEXT = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";

const WORDS = RAW_TEXT.split(" ");
/**
 * generates Lorem Ipsum text of a specific character length.
 * @param {number} length - maximum characters allowed.
 * @returns {string} - generated text.
 */
export function generateLoremIpsum(length) {
    if (!length || length <= 0) return "";

    let generatedWords = [];
    let currentLength = 0; // sum of characters of words only

    // loop until we can't fit any more words
    let safeGuard = 0;
    while (safeGuard < length) {
        safeGuard++;
        
        // random word
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        
        const potentialLength = currentLength + word.length + generatedWords.length;

        if (potentialLength <= length) {
            generatedWords.push(word);
            currentLength += word.length;
        } else {
            // if the random word did not fit, we try a few more times to find a shorter word
            // or just break if very close to the limit
            break; 
        }
    }

    return generatedWords.join(" ");
}