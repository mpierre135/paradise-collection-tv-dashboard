import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: "#F5EFE5",
        palm: "#1A6D62",
        lagoon: "#0F4C5C",
        coral: "#D97757",
        night: "#0A1F2B"
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Manrope", "Avenir Next", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        glow: "0 10px 40px rgba(0, 0, 0, 0.24)"
      },
      backgroundImage: {
        "lux-gradient": "linear-gradient(135deg, rgba(12,42,55,0.85), rgba(31,109,98,0.70), rgba(217,119,87,0.55))"
      }
    }
  },
  plugins: []
};

export default config;
