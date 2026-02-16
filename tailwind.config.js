/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './index.ts',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                primary: '#0D1117',
                surface: '#161B22',
                'surface-elevated': '#21262D',
                'text-primary': '#E6EDF3',
                'text-secondary': '#8B949E',
                accent: '#58A6FF',
                success: '#3FB950',
                warning: '#D29922',
                danger: '#F85149',
                'severity-low': '#3FB950',
                'severity-mid': '#D29922',
                'severity-high': '#F85149',
            },
            fontFamily: {
                sans: ['System'],
            },
        },
    },
    plugins: [],
};
