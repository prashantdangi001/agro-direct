import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#006948",
        "primary-container": "#00855d",
        "primary-fixed": "#85f8c4",
        secondary: "#904d00",
        "secondary-container": "#fe932c",
        tertiary: "#515c71",
        background: "#f7f9fb",
        surface: "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#191c1e",
        "on-surface-variant": "#3d4a42",
        outline: "#6d7a72",
        "outline-variant": "#bccac0",
      },
      spacing: {
        unit: "8px",
        gutter: "24px",
        "margin-desktop": "48px",
        "margin-mobile": "16px",
      },
      borderRadius: {
        DEFAULT: "0.5rem", // 8px per DESIGN.md
        lg: "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;