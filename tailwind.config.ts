import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // Golden Yellow - Royal, Clarity, Intellect
          50: '#fffef0',
          100: '#fffce0',
          200: '#fff9c2',
          300: '#fff5a3',
          400: '#fff285',
          500: '#FFD700', // Primary Golden Yellow
          600: '#e6c200',
          700: '#ccad00',
          800: '#b39900',
          900: '#998500',
        },
        secondary: {
          // Solid Green - Harmony, Ever Grow, Commitment
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#32CD32', // Primary Green
          600: '#22c55e',
          700: '#16a34a',
          800: '#15803d',
          900: '#166534',
        },
        accent: {
          // Dark Blue - Wisdom, Confidence, Truth
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#00008B', // Primary Dark Blue
          600: '#00007a',
          700: '#000069',
          800: '#000058',
          900: '#000047',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
