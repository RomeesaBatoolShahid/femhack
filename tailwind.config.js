/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelPink: '#FFD1DC',
        pastelPurple: '#DCC6E0',
        pastelBlue: '#AED7E0',
      },
    },
  },
  plugins: [],
}
