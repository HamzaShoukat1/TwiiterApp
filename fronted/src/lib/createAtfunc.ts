/**
 * Formats a timestamp into a human-readable relative time string (e.g., "5 minutes ago").
 * @param {string} timestampString The ISO 8601 timestamp string (e.g., "2025-01-24T12:00:00Z").
 * @returns {string} A relative time string.
 */
export function formatRelativeTime(timestampString:any) {
    const now = new Date();
    const pastDate = new Date(timestampString);
    const secondsElapsed = Math.floor((now - pastDate) / 1000);

    // Define time intervals in seconds
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(secondsElapsed / interval.seconds);
        if (count >= 1) {
            // Use plural or singular label
            const label = count === 1 ? interval.label : `${interval.label}s`;
            return `${count} ${label} ago`;
        }
    }

    // Fallback for timestamps in the future or very recent ones
    return "just now";
}

// --- Example Usage ---
// Note: You can replace these with your actual 'createdAt' values.
const pastTimestamp = "2025-01-24T09:30:00Z"; // Assuming current time is later
const veryRecentTimestamp = new Date(new Date().getTime() - 30 * 1000).toISOString(); // 30 seconds ago

console.log(`Time for pastTimestamp: ${formatRelativeTime(pastTimestamp)}`);
console.log(`Time for veryRecentTimestamp: ${formatRelativeTime(veryRecentTimestamp)}`);
