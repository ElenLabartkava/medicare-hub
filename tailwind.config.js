/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medicare: {
          primary: "#0284c7",
          primaryHover: "#0369a1",
          secondary: "#0d9488",
          surface: "#f8fafc",
          dark: "#0f172a",
          border: "#e2e8f0",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}