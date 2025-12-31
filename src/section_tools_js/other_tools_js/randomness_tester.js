import jStat from 'jstat';

/**
 * Randomness Tester - Chi-Square Test
 * tests if a sequence of numbers [0, 1) is uniformly distributed.
 */

export class RandomnessTester {
    constructor(numBins = 10) {
        this.numBins = numBins;
    }
    /**
     * performs Chi-Square test on the input sequence.
     * @param {number[]} randomNumbers - array of numbers between 0 and 1.
     */
    testSequence(randomNumbers) {
        if (!randomNumbers || randomNumbers.length === 0) {
            throw new Error("Input sequence is empty.");
        }

        if (!randomNumbers.every(n => n >= 0 && n < 1)) {
            throw new Error("All numbers must be in the range [0, 1).");
        }

        const n = randomNumbers.length;
        const expectedCount = n / this.numBins;
        
        // histogram
        const observed = new Array(this.numBins).fill(0);
        for (const num of randomNumbers) {
            const binIndex = Math.floor(num * this.numBins);
            // edge case if num is exactly 1
            if (binIndex < this.numBins) {
                observed[binIndex]++;
            } else {
                observed[this.numBins - 1]++;
            }
        }

        // Chi-Square statistic
        let chi2Stat = 0;
        for (const obs of observed) {
            chi2Stat += Math.pow(obs - expectedCount, 2) / expectedCount;
        }

        // p-value
        const dof = this.numBins - 1;
        // p-value = 1 - CDF(chi2, dof)
        const pValue = 1 - jStat.chisquare.cdf(chi2Stat, dof);

        return {
            chi2Stat: chi2Stat,
            pValue: pValue,
            passed: pValue > 0.05, // 5% significance level
            observed: observed,
            expected: expectedCount
        };
    }
}

export function parseInputSequence(text) {
    return text.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
}