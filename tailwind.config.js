/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            colors: {
                'pale': {
                    DEFAULT: '#6B7280',
                    50: '#CDD0D5',
                    100: '#C2C5CC',
                    200: '#ACB0BA',
                    300: '#969BA7',
                    400: '#7F8694',
                    500: '#6B7280',
                    600: '#515761',
                    700: '#383C43',
                    800: '#1E2024',
                    900: '#0A0A0A',
                    950: '#000000'
                },
                'malachite': {
                    DEFAULT: '#1BD96A',
                    50: '#B6F6D0',
                    100: '#A4F4C5',
                    200: '#7FEFAE',
                    300: '#5BEB97',
                    400: '#37E680',
                    500: '#1BD96A',
                    600: '#15A752',
                    700: '#0F7539',
                    800: '#084321',
                    900: '#021109',
                    950: '#000000'
                },
                'flamingo': {
                    DEFAULT: '#F16436',
                    50: '#FDE8E2',
                    100: '#FCDACF',
                    200: '#F9BCA8',
                    300: '#F69F82',
                    400: '#F4815C',
                    500: '#F16436',
                    600: '#DF4310',
                    700: '#AB330C',
                    800: '#762308',
                    900: '#421405',
                    950: '#280C03'
                },
            },
        }
    },
    plugins: []
}
