/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rosa: {
          cha: '#F4C2C2', // Tea Rose
          antigo: '#D18E9F', // Antique/Dusty Pink
          claro: '#FDE4E4', // Lighter pink
          forte: '#B45F74', // Stronger accent
        },
        offwhite: '#FAF9F6', // Off-white
        gold: {
          DEFAULT: '#D4AF37', // Gold
          light: '#F2D675',
          dark: '#AA8C2C',
        },
        // Earthy tones for contrast if needed
        terra: '#8D6E63',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')", // We can use a subtle pattern or CSS gradient
      }
    },
  },
  plugins: [],
}
