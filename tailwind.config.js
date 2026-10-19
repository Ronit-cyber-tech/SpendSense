/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#0f172a",
        success: "#16a34a",
        danger: "#dc2626",
        warning: "#f59e0b",
      },

      boxShadow: {
        card: "0 4px 20px rgba(15, 23, 42, 0.06)",
      },
    },
  },

  plugins: [],
};