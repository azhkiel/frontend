import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2F5233",
          dark:    "#1E3820",
          light:   "#3D6B47",
          50:      "#EFF5F0",
          100:     "#D3E5D7",
        },
        accent: {
          DEFAULT: "#D9A441",
          dark:    "#B8872E",
          light:   "#E8BD6A",
        },
        surface: "#F7F5F0",
        border:  "#DDD9D0",
        text: {
          primary:   "#2B2B26",
          secondary: "#4A4A40",
          muted:     "#767668",
        },
      },
      fontFamily: {
        // Bricolage Grotesque: display headings (H1, H2)
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        // Plus Jakarta Sans: body, H3+, labels, UI elements
        body:    ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        // Keep 'heading' alias pointing to display for backward compat
        heading: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",   /* inputs, badges */
        md: "0.5rem",    /* buttons, cards */
        lg: "0.75rem",   /* cards besar */
        xl: "1rem",      /* modals */
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(43 43 38 / 0.06)",
        md: "0 4px 12px 0 rgb(43 43 38 / 0.10)",
        lg: "0 8px 24px 0 rgb(43 43 38 / 0.12)",
      },
      fontSize: {
        // Modular scale 1.25 — deliberate hierarchy
        "display-lg": ["2.441rem", { lineHeight: "1.15", fontWeight: "700" }],
        "display-md": ["1.953rem", { lineHeight: "1.2",  fontWeight: "700" }],
        "display-sm": ["1.563rem", { lineHeight: "1.25", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};

export default config;
