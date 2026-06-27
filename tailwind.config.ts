import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neon: {
          green: "#00ff88",
          blue: "#00d4ff",
          purple: "#8b5cf6",
        },
        surface: {
          DEFAULT: "rgba(15, 23, 42, 0.75)",
          light: "rgba(255, 255, 255, 0.08)",
          card: "rgba(30, 41, 59, 0.6)",
        },
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at top, rgba(0, 255, 136, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(0, 212, 255, 0.12) 0%, transparent 50%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 212, 255, 0.08) 100%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 255, 136, 0.3)",
        "neon-blue": "0 0 20px rgba(0, 212, 255, 0.3)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.37)",
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        float: "float 6s ease-in-out infinite",
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
