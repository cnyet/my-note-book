/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/v-ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        abyss: "#0a0a0f",
        void: "#050508",
        surface: "rgba(26, 26, 36, 0.7)",
        primary: {
          DEFAULT: "#00f2ff", // Cyber-Cyan
          glow: "rgba(0, 242, 255, 0.4)",
        },
        accent: {
          DEFAULT: "#bc13fe", // Neon-Purple
          glow: "rgba(188, 19, 254, 0.4)",
        },
        success: "#00ff88",
        warning: "#ffaa00",
        error: "#ff3366",
        info: "#00f2ff",
        text: {
          primary: "#f8f8f8",
          secondary: "#a0a0b0",
          muted: "#606070",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Outfit", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(to right, #00f2ff, #bc13fe)",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(0, 242, 255, 0.4)",
        "glow-accent": "0 0 20px rgba(188, 19, 254, 0.4)",
        "glass-border": "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
