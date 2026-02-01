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
        // RET Brand Colors
        ret: {
          blue: '#1A4A94',      // Royal Blue - Primary (Navbar, Footer, Buttons)
          'blue-dark': '#143870',
          'blue-light': '#2563CC',
          gold: '#FFC107',      // Logo Gold - Accent (hover, active nav, icons)
          'gold-dark': '#E6AC00',
          'gold-light': '#FFD54F',
          offWhite: '#F8F9FA',  // Main body background
          white: '#FFFFFF',     // Cards
          border: '#E9ECEF',    // Card borders
          'heading': '#0F2942', // Dark blue for headings
        },
        // Keep legacy aliases for gradual migration
        primary: {
          50: '#E8EEF7',
          100: '#D1DEEF',
          200: '#A3BDE0',
          300: '#759CD0',
          400: '#477BC1',
          500: '#1A4A94', // Royal Blue
          600: '#143870',
          700: '#0F2942',
          800: '#0A1C2B',
          900: '#050E15',
        },
        accent: {
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FFC107', // Logo Gold
          600: '#E6AC00',
          700: '#CC9600',
          800: '#B38000',
          900: '#996B00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ret-card': '0 2px 8px rgba(26, 74, 148, 0.06)',
        'ret-card-hover': '0 8px 24px rgba(26, 74, 148, 0.12)',
      },
    },
  },
  plugins: [],
}
export default config
