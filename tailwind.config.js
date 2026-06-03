/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        hovercard: {
          "0%": { rotate: "0deg" },
          "25%": { rotate: "-3deg" },
          "75%": { rotate: "3deg" },
          "100%": { rotate: "0deg" },
        },
      },
      animation: {
        hovercard: "hovercard 4s infinite forwards linear",
      },
    },
  },
  plugins: [],
}

