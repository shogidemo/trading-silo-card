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
        // 農業・自然テーマのカラーパレット
        wheat: {
          50: "#fefdf8",
          100: "#fdf9e7",
          200: "#faf0c3",
          300: "#f5e291",
          400: "#efd15a",
          500: "#e6bc2e",
          600: "#d4a21f",
          700: "#b0801b",
          800: "#8f651e",
          900: "#76531d",
        },
        earth: {
          50: "#f9f6f3",
          100: "#f0e9e1",
          200: "#e0d2c3",
          300: "#cdb59d",
          400: "#b89577",
          500: "#a87d5c",
          600: "#9a6c4f",
          700: "#805743",
          800: "#69483b",
          900: "#573d33",
        },
        leaf: {
          50: "#f4f9f4",
          100: "#e6f2e6",
          200: "#cee5cf",
          300: "#a7d0a9",
          400: "#78b47c",
          500: "#539758",
          600: "#3f7a44",
          700: "#346138",
          800: "#2d4e30",
          900: "#264129",
        },
        silo: {
          50: "#f5f7fa",
          100: "#ebeef3",
          200: "#d3dae4",
          300: "#acbbcd",
          400: "#8097b1",
          500: "#607b98",
          600: "#4c637e",
          700: "#3e5167",
          800: "#364556",
          900: "#303c4a",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
