/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F9F9F7',
          dark: '#0D0E0D',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#151615',
        },
        card: {
          light: '#FFFFFF',
          dark: '#181A18',
          hoverLight: '#F5F5F2',
          hoverDark: '#1D201D',
        },
        border: {
          light: '#E7E7E3',
          dark: '#282A28',
        },
        divider: {
          light: '#EEEEEB',
          dark: '#222522',
        },
        sage: {
          DEFAULT: '#6FAF8A',
          dark: '#8FC5A3',
          hoverLight: '#5F9D78',
          hoverDark: '#A4D2B5',
          softLight: '#EAF4ED',
          softDark: '#203126',
          textLight: '#356B4B',
          textDark: '#B9DFC5',
        },
        // Alias accent to sage
        accent: {
          DEFAULT: '#6FAF8A',
          dark: '#8FC5A3',
          hoverLight: '#5F9D78',
          hoverDark: '#A4D2B5',
          softLight: '#EAF4ED',
          softDark: '#203126',
          textLight: '#356B4B',
          textDark: '#B9DFC5',
        },
        semantic: {
          rising: '#5F9D78',
          risingDark: '#8FC5A3',
          emerging: '#6FAF8A',
          emergingDark: '#8FC5A3',
          cooling: '#8A8D88',
          warning: '#C7A35B',
          alert: '#C97970',
        },
        text: {
          primaryLight: '#171717',
          primaryDark: '#F4F4F1',
          secondaryLight: '#6B6B6B',
          secondaryDark: '#9A9D99',
          mutedLight: '#969696',
          mutedDark: '#6F736E',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        btn: '8px',
        card: '10px',
        input: '8px',
        modal: '12px',
      }
    },
  },
  plugins: [],
}

