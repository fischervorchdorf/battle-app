/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'museum-paper': '#fdfcf8',
        'museum-charcoal': '#2d2a26',
        'museum-stone': '#e5e0d6',
        'museum-gold': '#c5a059',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c5a059 0%, #d4b06a 100%)',
      },
      fontFamily: {
        'serif': ['Cinzel', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}