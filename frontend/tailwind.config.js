/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#aa3bff',
        darkbg: '#16171d',
      }
    },
  },
  plugins: [],
}
