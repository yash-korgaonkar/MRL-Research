export const Colors = {
    background: '#0D1117',
    surface: '#161B22',
    surfaceElevated: '#21262D',
    border: '#30363D',
    textPrimary: '#E6EDF3',
    textSecondary: '#8B949E',
    textMuted: '#484F58',
    accent: '#58A6FF',
    accentDim: '#1F6FEB',
    success: '#3FB950',
    successDim: '#238636',
    warning: '#D29922',
    warningDim: '#9E6A03',
    danger: '#F85149',
    dangerDim: '#DA3633',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
};

export const SeverityColors: Record<string, string> = {
    low: Colors.success,
    mid: Colors.warning,
    high: Colors.danger,
};

export function severityColor(score: number): string {
    if (score <= 3) return Colors.success;
    if (score <= 6) return Colors.warning;
    return Colors.danger;
}

export const ChartColors = {
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surfaceElevated,
    color: (opacity = 1) => `rgba(88, 166, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(139, 148, 158, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: Colors.accent,
    },
};
