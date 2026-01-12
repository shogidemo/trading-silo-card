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
        // Industrial-Organic カラーパレット
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
        concrete: {
          50: "#faf9f7",
          100: "#f0ede8",
          200: "#e0dbd2",
          300: "#c9c1b4",
          400: "#9c9586",
          500: "#7a7265",
          600: "#5c554a",
          700: "#4a453a",
          800: "#3a362e",
          900: "#2a2520",
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
        // 既存のカテゴリカラー（互換性のため維持）
        wheat: {
          50: "#fefcf3",
          100: "#fdf6dc",
          500: "#b8860b",
        },
        earth: {
          50: "#faf9f7",
          100: "#f0ede8",
          500: "#7a7265",
          700: "#4a453a",
          800: "#3a362e",
        },
        leaf: {
          500: "#6b8e23",
          600: "#4a6118",
          700: "#3d5015",
        },
        silo: {
          500: "#607b98",
          600: "#4c637e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Hiragino Sans", "sans-serif"],
        body: ["var(--font-body)", "Hiragino Sans", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        english: ["var(--font-english)", "Nunito", "sans-serif"],
      },
      animation: {
        "shimmer": "shimmer 3s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "grain": "grain 8s steps(10) infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "holographic": "linear-gradient(135deg, hsl(0, 70%, 65%), hsl(60, 70%, 65%), hsl(120, 70%, 65%), hsl(180, 70%, 65%), hsl(240, 70%, 65%), hsl(300, 70%, 65%))",
      },
    },
  },
  plugins: [],
};
export default config;
