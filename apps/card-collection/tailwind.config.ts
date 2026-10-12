import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // A「港のアトラス」の色。既存クラス名はゲーム画面との互換用。
        gold: {
          50: "#f2fbf7",
          100: "#e8f7f1",
          200: "#d5f1e8",
          300: "#a6d7ca",
          400: "#79c1b2",
          500: "#117d79",
          600: "#0e6966",
          700: "#0d5753",
          800: "#104947",
          900: "#103c52",
        },
        concrete: {
          50: "#ffffff",
          100: "#f1f7fa",
          200: "#d8e5e8",
          300: "#c0d3db",
          400: "#6e8793",
          500: "#4d6977",
          600: "#3b5c6d",
          700: "#244c60",
          800: "#194459",
          900: "#153d52",
        },
        harvest: {
          50: "#f2fbf7",
          100: "#e8f7f1",
          200: "#d5f1e8",
          300: "#a6d7ca",
          400: "#117d79",
          500: "#0e6966",
          600: "#0d5753",
          700: "#104947",
          800: "#103c52",
          900: "#153d52",
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
          50: "#f2fbf7",
          100: "#e8f7f1",
          500: "#117d79",
        },
        earth: {
          50: "#ffffff",
          100: "#f1f7fa",
          500: "#4d6977",
          700: "#244c60",
          800: "#194459",
        },
        leaf: {
          500: "#117d79",
          600: "#0d5753",
          700: "#104947",
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
