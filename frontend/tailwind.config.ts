import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2A4A",
          light: "#2C4066",
          dark: "#111B31",
        },
        brass: {
          DEFAULT: "#C89B3C",
          light: "#E0BA6A",
          dark: "#9C761F",
        },
        teal: {
          DEFAULT: "#2F6F62",
          light: "#40907F",
          dark: "#1F4A41",
        },
        paper: "#F6F5F1",
        ink: "#1A1A1A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "stamp-lines":
          "repeating-linear-gradient(135deg, rgba(27,42,74,0.04) 0px, rgba(27,42,74,0.04) 1px, transparent 1px, transparent 12px)",
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
