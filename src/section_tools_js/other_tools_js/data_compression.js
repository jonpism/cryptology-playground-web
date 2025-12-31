class Node {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

/**
 * min-heap for priority queue
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(node) {
        this.heap.push(node);
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this._bubbleDown(0);
        }
        return min;
    }

    size() {
        return this.heap.length;
    }

    _bubbleUp(index) {
        const element = this.heap[index];
        while (index > 0) {
            let parentIdx = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIdx];
            if (element.freq >= parent.freq) break;
            this.heap[index] = parent;
            index = parentIdx;
        }
        this.heap[index] = element;
    }

    _bubbleDown(index) {
        const length = this.heap.length;
        const element = this.heap[index];
        while (true) {
            let leftChildIdx = 2 * index + 1;
            let rightChildIdx = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length) {
                leftChild = this.heap[leftChildIdx];
                if (leftChild.freq < element.freq) {
                    swap = leftChildIdx;
                }
            }

            if (rightChildIdx < length) {
                rightChild = this.heap[rightChildIdx];
                if (
                    (swap === null && rightChild.freq < element.freq) ||
                    (swap !== null && rightChild.freq < leftChild.freq)
                ) {
                    swap = rightChildIdx;
                }
            }

            if (swap === null) break;
            this.heap[index] = this.heap[swap];
            index = swap;
        }
        this.heap[index] = element;
    }
}

/**
 * Huffman compression class
 */
export class HuffmanCompressor {
    constructor() {
        this.codes = {};
        this.reverseCodes = {};
    }

    compress(text) {
        if (!text) return "";

        // frequency count
        const freqMap = {};
        for (const char of text) {
            freqMap[char] = (freqMap[char] || 0) + 1;
        }

        // build tree
        const heap = new MinHeap();
        for (const [char, freq] of Object.entries(freqMap)) {
            heap.push(new Node(char, freq));
        }

        // single unique char
        if (heap.size() === 1) {
            const node = heap.pop();
            this.codes[node.char] = "0";
            this.reverseCodes["0"] = node.char;
            return "0".repeat(node.freq);
        }

        while (heap.size() > 1) {
            const left = heap.pop();
            const right = heap.pop();
            const merged = new Node(null, left.freq + right.freq, left, right);
            heap.push(merged);
        }

        const root = heap.pop();
        this._generateCodes(root, "");

        // encode
        return text.split('').map(char => this.codes[char]).join('');
    }

    _generateCodes(node, currentCode) {
        if (!node) return;
        if (node.char !== null) {
            this.codes[node.char] = currentCode;
            this.reverseCodes[currentCode] = node.char;
            return;
        }
        this._generateCodes(node.left, currentCode + "0");
        this._generateCodes(node.right, currentCode + "1");
    }

    /**
     * get efficiency stats
     */
    getStats(originalText, compressedData) {
        const originalBits = originalText.length * 8; // 8-bit ASCII/UTF-8 base
        const compressedBits = compressedData.length;
        const ratio = (1 - (compressedBits / originalBits)) * 100;
        return {
            originalBits,
            compressedBits,
            ratio: ratio.toFixed(2)
        };
    }
}