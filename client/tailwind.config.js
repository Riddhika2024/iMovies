/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prime: {
          bg: "#0A0E17",
          slate: "#0F172A",
          card: "#131B2E",
          cardHover: "#1A253D",
          border: "#1E293B",
          blue: "#00A8E1",
          blueHover: "#0092C5",
          darkBlue: "#00509D",
          cyan: "#38BDF8",
          gold: "#F59E0B",
          seat: {
            available: "#334155",
            selected: "#10B981",
            locked: "#F59E0B",
            booked: "#1E293B",
            balcony: "#8B5CF6",
            middle: "#00A8E1",
            lower: "#06B6D4"
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
