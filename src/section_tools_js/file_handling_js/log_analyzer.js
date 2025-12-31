/**
 * Log Analyzer
 * extract statistics on levels, IPs, and timestamps from log files
 */
export function analyzeLog(logText) {
    if (!logText) throw new Error("Log file is empty.");

    // INFO, ERROR, WARN, WARNING, DEBUG
    const levelPattern = /\b(INFO|ERROR|WARN|WARNING|DEBUG|FATAL|CRITICAL)\b/i;
    
    // IPv4 addresses
    const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
    
    // timestamps (ISO-like: YYYY-MM-DD HH:MM:SS or with T)
    const tsPattern = /\b\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}\b/;

    const stats = {
        levels: {},
        ips: {},
        timestamps: {},
        totalLines: 0
    };

    // process line by line
    const lines = logText.split(/\r?\n/);
    stats.totalLines = lines.length;

    for (const line of lines) {
        if (!line.trim()) continue; // skip empty lines

        // extract level
        const levelMatch = line.match(levelPattern);
        if (levelMatch) {
            // normalize
            let lvl = levelMatch[0].toUpperCase();
            if (lvl === 'WARN') lvl = 'WARNING';
            stats.levels[lvl] = (stats.levels[lvl] || 0) + 1;
        }

        // extract IP
        const ipMatch = line.match(ipPattern);
        if (ipMatch) {
            const ip = ipMatch[0];
            stats.ips[ip] = (stats.ips[ip] || 0) + 1;
        }

        // extract timestamp
        const tsMatch = line.match(tsPattern);
        if (tsMatch) {
            const ts = tsMatch[0];
            stats.timestamps[ts] = (stats.timestamps[ts] || 0) + 1;
        }
    }

    return stats;
}

/**
 * sort dictionary by frequency (descending)
 */
export function getTopItems(freqMap, limit = 10) {
    return Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1]) // sort by count desc
        .slice(0, limit)
        .map(([key, count]) => ({ key, count }));
}

/**
 * generate CSS conic-gradient for Pie Chart
 */
export function generatePieGradient(data) {
    // data format: [{ label: 'INFO', count: 50, color: 'green' }, ...]
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentDeg = 0;
    const segments = [];

    data.forEach(item => {
        const deg = (item.count / total) * 360;
        segments.push(`${item.color} ${currentDeg}deg ${currentDeg + deg}deg`);
        currentDeg += deg;
    });

    return `conic-gradient(${segments.join(', ')})`;
}