/**
 * converts text to HTML Entities and vice-versa.
 * @param {string} input - input string.
 * @param {string} mode - 'char2entity' or 'entity2char'.
 */
export function processHtmlEntity(input, mode) {
    if (!input) return "";

    if (mode === 'char2entity') {
        return textToEntities(input);
    } else {
        return entitiesToText(input);
    }
}

/**
 * Text to HTML Entities
 */
function textToEntities(text) {
    // regex replace to catch them first
    let result = text.replace(/[\u00A0-\u9999<>&"']/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
    
    return text.replace(/[<>&"']|[\u00A0-\u9999]/g, function(c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
            case "'": return '&apos;';
            default: return '&#' + c.charCodeAt(0) + ';';
        }
    });
}

/**
 * HTML Entities to Text
 */
function entitiesToText(entityStr) {
    // use the browser's own DOM parser.
    
    if (typeof DOMParser === "undefined") {
        return entityStr; 
    }

    const doc = new DOMParser().parseFromString(entityStr, "text/html");
    return doc.documentElement.textContent;
}