/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        charcoal: '#333333',
        navy: '#00124e',
        'editorial-navy': '#001366',
        'editorial-crimson': '#520000',
        'editorial-gold': '#b8973a',
        'editorial-cream': '#faf8f4',
        'editorial-ink': '#1a1a2e',
        'editorial-muted': '#6b6b80',
        'editorial-border': '#ddd8cc',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'serif-editorial': ['Cormorant Garamond', 'serif'],
        'title': ['Cinzel', 'serif'],
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'slide-up': 'slideUp 0.7s ease both',
      }
    },
  },
  plugins: [],
}
