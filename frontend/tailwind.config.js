/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  // purge: [],
  // darkMode: false,
  theme: {
    extend: {
      backgroundColor: {
        primary: '#243056',
        secondary: '#5981F3',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};