export function analyzeFrequency(text) {
    if (!text) throw new Error("Please enter text to analyze.");

    // lowercase, keep only a-z
    const cleanText = text.toLowerCase().replace(/[^a-z]/g, '');
    const totalChars = cleanText.length;

    if (totalChars === 0) {
        throw new Error("No alphabetic characters found in the text.");
    }

    // count frequencies
    const counts = {};
    for (const char of cleanText) {
        counts[char] = (counts[char] || 0) + 1;
    }

    // convert to Sorted Array
    const frequencyData = Object.keys(counts)
        .map(char => {
            const count = counts[char];
            return {
                char: char,
                count: count,
                percent: (count / totalChars) * 100
            };
        })
        .sort((a, b) => b.count - a.count); // sort descending

    // get most common letter
    const mostCommon = frequencyData.length > 0 ? frequencyData[0] : null;

    return {
        totalChars,
        uniqueChars: frequencyData.length,
        mostCommon,
        data: frequencyData
    };
}