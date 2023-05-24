/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
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
                    900: '#050506',
                    950: '#000000'
                },
            }
        }
    },
    plugins: [],
}
