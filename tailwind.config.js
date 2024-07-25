/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        success: "#316140",
        danger: "#C17C74",
        primary: "#121063",
        banner: "#DDC9B4",
        navbar: "#2A3D45",
        marron: "#7A6C5D",
        khaki: "#BCAC9B",
      },
      fontFamily: {
        AA: ["AccordAlternate", "sans-serif"],
      },
    },
  },
  plugins: [],
};
