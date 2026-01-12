import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Maritime color palette
        ocean: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        navy: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        rust: {
          50: "#fdf6f3",
          100: "#fbe9e2",
          200: "#f7d4c7",
          300: "#efb49e",
          400: "#e48768",
          500: "#b7410e",
          600: "#9a360c",
          700: "#7d2c0a",
          800: "#612308",
          900: "#4a1b06",
        },
        // Grain-related colors (from card-collection)
        gold: {
          50: "#fefcf3",
          100: "#fdf6dc",
          200: "#f9e9b0",
          300: "#f2d67a",
          400: "#d4a937",
          500: "#b8860b",
          600: "#8b6914",
          700: "#6b5011",
          800: "#4d3a0d",
          900: "#3d2e06",
        },
        harvest: {
          50: "#f6f9f0",
          100: "#e8f0d8",
          200: "#d1e2b2",
          300: "#b3ce82",
          400: "#6b8e23",
          500: "#5a7a1d",
          600: "#4a6118",
          700: "#3d5015",
          800: "#323f12",
          900: "#283210",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Hiragino Sans", "sans-serif"],
        body: ["var(--font-body)", "Hiragino Sans", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "wave": "wave 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "dice-roll": "dice-roll 0.5s ease-out",
        "ship-bob": "ship-bob 3s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "dice-roll": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.2)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        "ship-bob": {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
