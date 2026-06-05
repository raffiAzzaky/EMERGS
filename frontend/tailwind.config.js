/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--color-background), <alpha-value>)",
        sidebar: "rgba(var(--color-sidebar), <alpha-value>)",
        card: "rgba(var(--color-card), <alpha-value>)",
        primary: "rgba(var(--color-primary), <alpha-value>)",
        accent: "rgba(var(--color-accent), <alpha-value>)",
        text: "rgba(var(--color-text), <alpha-value>)",
        border: "rgba(var(--color-border), <alpha-value>)",
        danger: "#E74C3C",
      },
    },
  },
  plugins: [],
};

