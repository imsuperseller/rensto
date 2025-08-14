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
        background: "#0B1318",
        card: "#111827",
        text: "#E5E7EB",
        muted: "#94A3B8",
        accent1: "#2F6A92",
        accent2: "#FF6536",
        border: "rgba(255,255,255,0.08)",
      },
      borderRadius: {
        DEFAULT: "1rem",
      },
      boxShadow: {
        glass: "0 10px 30px rgba(0,0,0,0.25)",
        glow: "0 0 20px rgba(47,106,146,0.3)",
      },
      animation: {
        "logo-glow": "glow 2s ease-in-out infinite alternate",
        "fade-up": "fadeUp 0.9s ease-out forwards",
      },
      keyframes: {
        glow: {
          "0%": { filter: "drop-shadow(0 0 5px rgba(47,106,146,0.3))" },
          "100%": { filter: "drop-shadow(0 0 20px rgba(47,106,146,0.6))" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        glass: "blur(10px)",
      },
    },
  },
  plugins: [],
};

export default config;
