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
        // Retro Game Color Palette (5-color system)
        retro: {
          navy: "#1a237e",
          "navy-light": "#3949ab",
          "navy-lighter": "#5c6bc0",
        },
        cream: {
          DEFAULT: "#fff8e1",
          dark: "#ffe082",
          light: "#fffdf5",
        },
        gold: {
          DEFAULT: "#ffc107",
          dark: "#c79100",
          light: "#ffecb3",
        },
        vermillion: {
          DEFAULT: "#d32f2f",
          dark: "#b71c1c",
          light: "#ffcdd2",
        },
        seagreen: {
          DEFAULT: "#00897b",
          dark: "#00695c",
          light: "#b2dfdb",
        },
        // Map background
        sky: {
          light: "#e3f2fd",
          grid: "#bbdefb",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Hiragino Sans", "sans-serif"],
        body: ["var(--font-body)", "Hiragino Sans", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "game-title": ["1.75rem", { lineHeight: "2rem", fontWeight: "700" }],
        "game-heading": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "700" }],
        "game-body": ["1rem", { lineHeight: "1.5rem", fontWeight: "500" }],
        "game-small": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
      },
      borderRadius: {
        game: "12px",
        "game-sm": "8px",
      },
      boxShadow: {
        "game-panel": "4px 4px 0 #1a237e",
        "game-panel-hover": "6px 6px 0 #1a237e",
        "game-button": "3px 3px 0 #1a237e",
        "game-button-active": "1px 1px 0 #1a237e",
        "game-gold": "4px 4px 0 #c79100",
      },
      animation: {
        "dice-roll": "dice-roll 0.4s ease-out",
        "panel-enter": "panel-enter 0.2s ease-out",
      },
      keyframes: {
        "dice-roll": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.1)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        "panel-enter": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
