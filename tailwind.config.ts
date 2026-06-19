import type { Config } from "tailwindcss";

/**
 * Charte graphique OIJD - Section CIV
 * Inspiree du logo officiel : globe, flamme, ruban vert / blanc / orange.
 * Les couleurs sont egalement exposees en variables CSS dans app/globals.css.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ojid: {
          green: "#00860B",
          "green-dark": "#24752D",
          forest: "#0B3D17",
          "forest-deep": "#072A0F",
          orange: "#FC5D01",
          flame: "#FB8204",
          gray: "#EBECEB",
          bluegray: "#719D96",
        },
        digital: {
          purple: "#6F2DBD",
        },
        ink: "#121212",
        muted: "#667085",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-montserrat)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(16, 24, 40, 0.08), 0 4px 24px -8px rgba(16, 24, 40, 0.08)",
        card: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -12px rgba(16,24,40,0.12)",
        lift: "0 12px 32px -12px rgba(0, 134, 11, 0.22), 0 8px 16px -8px rgba(16,24,40,0.12)",
        glow: "0 8px 28px -8px rgba(252, 93, 1, 0.45)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        flame: {
          "0%, 100%": { transform: "translateY(0) scaleY(1)", opacity: "0.9" },
          "50%": { transform: "translateY(-3px) scaleY(1.06)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.3s ease-out both",
        flame: "flame 2.4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 40s linear infinite",
        shimmer: "shimmer 1.6s infinite",
        ticker: "ticker 40s linear infinite",
      },
      backgroundImage: {
        "ojid-radial":
          "radial-gradient(900px 500px at 80% -10%, rgba(252,93,1,0.10), transparent 55%), radial-gradient(800px 600px at 0% 0%, rgba(0,134,11,0.10), transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
