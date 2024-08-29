/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        success: "#8fc29f",
        danger: "#C17C74",
        primary: "#121063",
        banner: "#DDC9B4",
        navbar: "#2A3D45",
        marron: "#7A6C5D",
        khaki: "#BCAC9B",
        logo: "#B62361",
      },
      fontFamily: {
        AA: ["AccordAlternate", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],

  daisyui: {
    darkTheme: false,
    // themes: [
    //   {
    //     myTheme: {
    //       logo: "#b5235f",
    //     },
    //   },
    // ],
  },
};
