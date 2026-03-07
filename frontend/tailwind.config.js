/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        dark: {
          900: '#080a0c',
          800: '#111418',
          700: '#1a1f28',
          600: '#222834',
          500: '#2a3040',
        },
      },
    },
  },
  plugins: [],
};
