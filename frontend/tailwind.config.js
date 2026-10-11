/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mkd: {
          purple: '#2E1D67',
          yellow: '#FBBA00',
          pink: '#EB5893',
          green: '#00A552',
          orange: '#FF6900',
          beige: '#F0D8C2', 
          light: '#F4F5F8',
        }
      },
      fontFamily: {
        sans: ['Onest', 'sans-serif'],
      }
    },
  },
  plugins: [],
}