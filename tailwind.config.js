/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        deep: '#0B1026',
        panel: '#151B3B',
        accent: {
          violet: '#8B5CF6',
          // AA-contrast variants: light for small violet text on dark bg,
          // deep for solid button fills behind white text
          'violet-light': '#A78BFA',
          'violet-deep': '#7C3AED',
          cyan: '#22D3EE',
          coral: '#FB7185',
          amber: '#FBBF24',
          mint: '#34D399',
        },
        ink: {
          DEFAULT: '#F1F5F9',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
