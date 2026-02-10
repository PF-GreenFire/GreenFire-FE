/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-primary': '#4A7C59',
        'green-dark': '#3d6b4a',
        'green-light': '#D4E8D1',
        'green-lighter': '#E8F5E9',
        'green-badge': '#c8e6c9',
      },
    },
  },
  plugins: [],
}
