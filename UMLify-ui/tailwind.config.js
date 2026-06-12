/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ready for sleek canvas accents
        canvasBg: '#121214', 
        panelBg: '#1a1a1e',
      }
    },
  },
  plugins: [],
}