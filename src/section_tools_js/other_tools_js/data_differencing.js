export class DataDifferencing {    
    /**
     * create a linear delta between source and target.
     * iterate target and if match source: COPY, else: ADD. 
     * DELETE remaining source.
     * * @param {string} source 
     * @param {string} target 
     * @returns {Array} list of operations
     */
    createDelta(source, target) {
        const delta = [];
        let srcIdx = 0;
        let tgtIdx = 0;

        // process target vs source
        while (tgtIdx < target.length) {
            if (srcIdx < source.length && source[srcIdx] === target[tgtIdx]) {
                // copy from source char by char
                delta.push({ op: "COPY", index: srcIdx, len: 1, val: source[srcIdx] });
                srcIdx++;
                tgtIdx++;
            } else {
                // add from target
                delta.push({ op: "ADD", val: target[tgtIdx] });
                tgtIdx++;
            }
        }

        // handle trailing source characters
        while (srcIdx < source.length) {
            delta.push({ op: "DELETE", index: srcIdx, val: source[srcIdx] });
            srcIdx++;
        }

        return delta;
    }

    /**
     * reconstructs the target string using source + delta.
     * @param {string} source 
     * @param {Array} delta 
     * @returns {string} reconstructed target
     */
    applyDelta(source, delta) {
        let result = "";

        for (const operation of delta) {
            if (operation.op === "COPY") {
                // extract from source
                result += source.substr(operation.index, operation.len);
            } else if (operation.op === "ADD") {
                // add new literal value
                result += operation.val;
            }
            // DELETE operations are ignored during reconstruction 
        }

        return result;
    }
}