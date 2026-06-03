/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ECF4E8",
        sidebar: "#CBF3BB",
        primary: "#ABE7B2",
        accent: "#93BFC7",
        text: "#1F2937",
        danger: "#E74C3C",
      },
    },
  },
  plugins: [],
};

