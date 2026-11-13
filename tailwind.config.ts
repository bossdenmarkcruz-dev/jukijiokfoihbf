import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d7f2ff',
          200: '#b0e5ff',
          300: '#7dd1ff',
          400: '#4bb9ff',
          500: '#1d8efd',
          600: '#1175e4',
          700: '#125eb4',
          800: '#174f8c',
          900: '#183f6d'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
