import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * All values below are extracted from design-system/index.html
 * ("Design Tokens" reference section) — no HTML/markup was copied,
 * only the token values (colors, type scale, spacing, radius,
 * elevation, component sizing). Dark mode / runtime theming is
 * explicitly out of scope (docs/architecture.md §1), so tokens are
 * static hex values rather than CSS-variable indirection.
 */

/**
 * "Text 3" — the design system's foreground token for text on dark
 * Primary surfaces (primary buttons, active nav items, dark chips/badges).
 * Declared once here so the raw palette token and the semantic
 * `on-primary` role below can never drift apart.
 */
const TEXT_3 = "#F2F2F2";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Desktop-first breakpoints (docs/architecture.md — responsive requirements).
    // Tailwind variants remain min-width (`lg:`), but every named screen also
    // gets an auto-generated `max-*:` variant for authoring the desktop
    // baseline first and adapting downward for tablet/mobile.
    screens: {
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      xl: "1440px",
      "2xl": "1600px",
      "3xl": "1920px",
    },
    extend: {
      colors: {
        // Neutral surfaces & text
        bg: "#F2F2F2",
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#FAFAFA",
        },
        border: {
          DEFAULT: "#E4E4E4",
          strong: "#CFCFCF",
        },
        text: {
          DEFAULT: "#404040",
          secondary: "#595959",
          muted: "#8C8C8C",
          faint: "#ABABAB",
          heading: "#2B3936",
          // "Text 3" raw palette token. Not pure white, so it never
          // competes for contrast attention against a true white surface
          // elsewhere in the same view. Components should not reference
          // this directly — use the `on-primary` semantic role below.
          3: TEXT_3,
        },

        /**
         * Semantic role, not a raw color: the single source of truth for
         * "what text color goes on a dark Primary surface." Every
         * component that paints text on `primary-700/800/900` (buttons,
         * active nav items, dark chips/badges) should reference
         * `text-on-primary` — never the raw `text-text-3` token, and
         * never a hardcoded white/gray — so the decision lives in one
         * place. Backed by "Text 3" above.
         */
        "on-primary": TEXT_3,

        // Primary ramp — sage, derived around seed #A4BFBA
        primary: {
          50: "#EEF3F2",
          100: "#DCE7E4",
          200: "#C3D5D0",
          300: "#A4BFBA",
          400: "#85A49E",
          500: "#6C8B85",
          600: "#57736D",
          700: "#465D58",
          800: "#384A46",
          900: "#2B3936",
          DEFAULT: "#465D58",
          tint: "#A4BFBA",
          subtle: "#EEF3F2",
        },

        // Critical ramp — around seed #D95032
        critical: {
          50: "#FCEEEA",
          100: "#F7D6CC",
          200: "#EFAF9C",
          300: "#E5876B",
          400: "#DE6A48",
          500: "#D95032",
          600: "#C13E22",
          700: "#9E321C",
          DEFAULT: "#D95032",
        },

        // Semantic status — matched muted chroma
        success: {
          DEFAULT: "#3E9268",
          subtle: "#ECF4EF",
          border: "#D3E7DC",
          foreground: "#285F44",
        },
        warning: {
          DEFAULT: "#C68A2E",
          subtle: "#FBF2E2",
          border: "#F5E0B8",
          foreground: "#8A6218",
        },
        danger: {
          DEFAULT: "#D95032",
          subtle: "#FCEEEA",
          border: "#F7D6CC",
          foreground: "#9E321C",
        },
        info: {
          DEFAULT: "#3E6FA8",
          subtle: "#EAF1F8",
          border: "#CBDDF0",
          foreground: "#2E547E",
        },

        // shadcn/ui primitive aliases (static — no dark-mode theming in scope)
        background: "#F2F2F2",
        foreground: "#404040",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#404040",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#404040",
        },
        secondary: {
          DEFAULT: "#F2F2F2",
          foreground: "#404040",
        },
        muted: {
          DEFAULT: "#F2F2F2",
          foreground: "#8C8C8C",
        },
        accent: {
          DEFAULT: "#EEF3F2",
          foreground: "#2B3936",
        },
        destructive: {
          DEFAULT: "#D95032",
          foreground: "#FFFFFF",
        },
        input: "#CFCFCF",
        ring: "#A4BFBA",
      },

      fontFamily: {
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },

      // Type scale · 1.20 minor-third (size / weight / line-height)
      fontSize: {
        overline: ["11px", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.08em" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "500" }],
        "body-sm": ["13px", { lineHeight: "1.45", fontWeight: "400" }],
        body: ["15px", { lineHeight: "1.55", fontWeight: "400" }],
        "title-sm": ["16px", { lineHeight: "1.4", fontWeight: "600" }],
        h2: ["19px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.01em" }],
        h1: ["24px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.02em" }],
        display: ["34px", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.025em" }],
      },

      // Spacing scale (4/8/12/16/24/32/48/64) is already exactly Tailwind's
      // default numeric scale (1/2/3/4/6/8/12/16) — no extension needed.

      borderRadius: {
        sm: "3px",
        md: "6px",
        lg: "10px",
      },

      boxShadow: {
        card: "0 1px 2px rgba(43, 57, 54, 0.08)",
        popover: "0 4px 12px rgba(43, 57, 54, 0.10)",
        modal: "0 12px 32px rgba(43, 57, 54, 0.16)",
        "focus-ring": "0 0 0 3px rgba(164, 191, 186, 0.55)",
        "focus-ring-danger": "0 0 0 3px rgba(217, 80, 50, 0.16)",
      },

      // Component & icon sizing
      height: {
        "control-sm": "28px",
        "control-md": "36px",
        "control-lg": "44px",
        "row-compact": "36px",
        "row-comfort": "48px",
      },
      width: {
        "sidebar-dev": "256px",
        "sidebar-admin": "264px",
        "control-sm": "28px",
        "control-md": "36px",
        "control-lg": "44px",
      },
      minWidth: {
        "hit-target": "44px",
      },
      minHeight: {
        "hit-target": "44px",
      },

      maxWidth: {
        content: "1280px",
        measure: "680px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
