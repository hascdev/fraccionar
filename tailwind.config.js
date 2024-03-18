const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // for next-themes
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--skin-font-sans)"],
      },
      colors: {
        'skin': {
          50: 'rgb(var(--skin-color-50) / <alpha-value>)',
          100: 'rgb(var(--skin-color-100) / <alpha-value>)',
          200: 'rgb(var(--skin-color-200) / <alpha-value>)',
          300: 'rgb(var(--skin-color-300) / <alpha-value>)',
          400: 'rgb(var(--skin-color-400) / <alpha-value>)',
          500: 'rgb(var(--skin-color-500) / <alpha-value>)',
          600: 'rgb(var(--skin-color-600) / <alpha-value>)',
          700: 'rgb(var(--skin-color-700) / <alpha-value>)',
          800: 'rgb(var(--skin-color-800) / <alpha-value>)',
          900: 'rgb(var(--skin-color-900) / <alpha-value>)'
        }
      }
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
