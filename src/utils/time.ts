export function formatDuration(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hours}h ${remainMins}m`;
}

export function timeSince(timestamp: number): string {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    const days = Math.floor(diffSec / 86400);
    return `${days}d ago`;
}

export function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatDateTime(timestamp: number): string {
    return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
}

export type DateRange = 'day' | 'week' | 'month';

export function dateRangeForView(range: DateRange): { start: number; end: number } {
    const now = Date.now();
    const end = now;
    let start: number;

    switch (range) {
        case 'day':
            start = now - 24 * 60 * 60 * 1000;
            break;
        case 'week':
            start = now - 7 * 24 * 60 * 60 * 1000;
            break;
        case 'month':
            start = now - 30 * 24 * 60 * 60 * 1000;
            break;
    }

    return { start, end };
}
