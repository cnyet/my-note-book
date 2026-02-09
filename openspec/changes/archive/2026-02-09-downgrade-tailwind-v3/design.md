# Design: Downgrading to Tailwind CSS v3

## 1. Package Changes

In `frontend/package.json`:

- **Remove**:
  - `tailwindcss: ^4`
  - `@tailwindcss/postcss: ^4`
- **Add**:
  - `tailwindcss: ^3.4.1`
  - `postcss: ^8.4.31`
  - `autoprefixer: ^10.4.16`

## 2. Configuration (`tailwind.config.js`)

Move theme tokens from CSS variables to `tailwind.config.js` theme section:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#0a0a0f",
        void: "#111118",
        surface: "#1a1a24",
        primary: {
          DEFAULT: "#00f2ff",
          glow: "rgba(0, 242, 255, 0.3)",
        },
        accent: {
          DEFAULT: "#bc13fe",
          glow: "rgba(188, 19, 254, 0.3)",
        },
        text: {
          p: "#f8f8f8",
          s: "#a0a0b0",
          m: "#606070",
        },
      },
      fontFamily: {
        heading: ["Outfit", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## 3. PostCSS Configuration (`postcss.config.js`)

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 4. Documentation Strategy

Ensure all mentions of "Tailwind 4" or "Tailwind v4" are replaced with "Tailwind 3" or "Tailwind v3".
Update code snippets in `frontend-guide.md` to show standard Tailwind v3 class usage if they currently use v4 specific syntax (though most are compatible).
Confirm that `globals.css` (once created) uses `@tailwind base; @tailwind components; @tailwind utilities;`.
