/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Isso força o Tremor a usar o seu roxo quando você escrever colors={["purple"]}
        purple: {
          DEFAULT: "#aa3bff",
          emphasis: "#7e22ce",
        },
      },
    },
  },
  plugins: [],
}