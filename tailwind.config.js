/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom:
          "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.07)",
      },
      screens: {
        xxs: "22.5rem", // 360px
        xs: "30rem", // 480px
        // sm, md, lg, xl are already defined by default
        xxl: "100rem", // 1600px
        xxxl: "160rem", // 2560px
      },
    },
  },
  plugins: [],
};
