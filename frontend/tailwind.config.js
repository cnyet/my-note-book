/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/v-ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "rgba(0, 242, 255, 0.4)", // Legacy support
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          glow: "rgba(188, 19, 254, 0.4)", // Legacy support
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Genesis System Colors (Legacy)
        abyss: "#0a0a0f",
        void: "#050508",
        surface: "rgba(26, 26, 36, 0.7)",
        // Duralux/Sneat Color System
        duralux: {
          primary: {
            DEFAULT: "#696cff",
            dark: "#5f61e6",
            light: "#7d80ff",
            transparent: "rgba(105, 108, 255, 0.1)",
          },
          success: {
            DEFAULT: "#71dd37",
            dark: "#64c430",
            transparent: "rgba(113, 221, 55, 0.1)",
          },
          warning: {
            DEFAULT: "#ffab00",
            dark: "#e69a00",
            transparent: "rgba(255, 171, 0, 0.1)",
          },
          danger: {
            DEFAULT: "#ff3e1d",
            dark: "#e6381a",
            transparent: "rgba(255, 62, 29, 0.1)",
          },
          info: {
            DEFAULT: "#03c3ec",
            dark: "#03adcf",
            transparent: "rgba(3, 195, 236, 0.1)",
          },
          text: {
            primary: "#566a7f",
            secondary: "#697a8d",
            muted: "#a1acb8",
            section: "#adadb4",
            dark: {
              primary: "#a3b1c2",
              secondary: "#8592a3",
              muted: "#696c80",
            },
          },
          bg: {
            page: "#f5f5f9",
            card: "#ffffff",
            hover: "#f5f5f9",
            dark: {
              page: "#232333",
              card: "#2b2c40",
              hover: "#323249",
            },
          },
          border: {
            light: "#eceef1",
            dark: "#444564",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Duralux radius values
        "duralux-card": "0.5rem",
        "duralux-button": "0.375rem",
        "duralux-input": "0.375rem",
        "duralux-badge": "0.375rem",
      },
      transitionTimingFunction: {
        "duralux": "ease-in-out",
      },
      transitionDuration: {
        "duralux": "200ms",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Outfit", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(to right, #00f2ff, #bc13fe)",
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(0, 242, 255, 0.4)",
        "glow-accent": "0 0 20px rgba(188, 19, 254, 0.4)",
        "glass-border": "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
        // Duralux/Sneat Shadow System
        "sneat-card": "0 2px 6px 0 rgba(67, 89, 113, 0.12)",
        "sneat-card-dark": "0 2px 6px 0 rgba(0, 0, 0, 0.25)",
        "sneat-hover": "0 4px 10px 0 rgba(67, 89, 113, 0.15)",
        "sneat-hover-dark": "0 4px 10px 0 rgba(0, 0, 0, 0.3)",
        "sneat-dropdown": "0 6px 12px 0 rgba(67, 89, 113, 0.15)",
        "sneat-dropdown-dark": "0 6px 12px 0 rgba(0, 0, 0, 0.35)",
        "sneat-active": "0 2px 6px rgba(105, 108, 255, 0.4)",
        "sneat-chart": "0 2px 4px 0 rgba(67, 89, 113, 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
