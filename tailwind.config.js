/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3",
          300: "#fda4af", 400: "#fb7185", 500: "#f43f5e",
          600: "#e11d48", 700: "#be123c",
        },
        blush: { DEFAULT: "#fce7f3", dark: "#fbcfe8" },
      },
      fontFamily: { sans: ["Poppins", "sans-serif"] },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(244,63,94,0.10)",
        card: "0 4px 24px rgba(244,63,94,0.08)",
      },
    },
  },
  plugins: [],
};
