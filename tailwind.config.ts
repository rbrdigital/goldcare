
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // New unified tokens - primary only for text
        bg: "var(--bg)",
        "bg-muted": "var(--bg-muted)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        border: "var(--border)",
        divider: "var(--divider)",
        primary: "var(--primary)",        /* ChatGPT Green - text only */
        "primary-50": "var(--primary-50)",    /* Light gray */
        "primary-100": "var(--primary-100)",  /* Darker gray */
        "primary/30": "var(--primary-30a)",   /* 10% black */
        "medical-blue": "var(--medical-blue)",      /* ChatGPT Green */
        "medical-blue-light": "var(--medical-blue-light)", /* Tertiary background */
        "medical-green": "var(--medical-green)",
        "medical-green-light": "var(--medical-green-light)",
        "medical-amber": "var(--medical-amber)",
        "medical-amber-light": "var(--medical-amber-light)",
        "medical-red": "var(--medical-red)",
        "medical-red-light": "var(--medical-red-light)",
        
        // Legacy tokens for backward compatibility
        "primary-fg": "var(--color-primary-fg)",
        "on-primary": "var(--color-on-primary)",
        secondary: "var(--color-secondary)",
        "secondary-fg": "var(--color-secondary-fg)",
        "button-primary": "var(--color-button-primary)",
        "button-primary-hover": "var(--color-button-primary-hover)",
        "button-primary-text": "var(--color-button-primary-text)",
        success: "var(--color-success)",
        "success-fg": "var(--color-success-fg)",
        danger: "var(--color-danger)",
        "danger-fg": "var(--color-danger-fg)",
        warning: "var(--color-warning)",
        "warning-fg": "var(--color-warning-fg)",
        muted: "var(--color-muted)",
        "muted-fg": "var(--color-muted-fg)",
        accent: "var(--color-accent)",
        "accent-fg": "var(--color-accent-fg)",
        popover: "var(--color-popover)",
        "popover-fg": "var(--color-popover-fg)",
        card: "var(--color-card)",
        "card-fg": "var(--color-card-fg)",
        input: "var(--color-input)",
        "input-border": "var(--color-input-border)",
        ring: "var(--color-ring)",
        "sidebar-bg": "var(--color-sidebar-bg)",
        "sidebar-fg": "var(--color-sidebar-fg)",
        "sidebar-primary": "var(--color-sidebar-primary)",
        "sidebar-primary-fg": "var(--color-sidebar-primary-fg)",
        "sidebar-accent": "var(--color-sidebar-accent)",
        "sidebar-accent-fg": "var(--color-sidebar-accent-fg)",
        "sidebar-border": "var(--color-sidebar-border)",
        "sidebar-ring": "var(--color-sidebar-ring)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "16px",
        full: "9999px",
        DEFAULT: "var(--radius-md)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        none: "none",
      },
      fontSize: {
        xs: ['12px', '18px'],
        sm: ['13px', '20px'],
        base: ['14px', '22px'],
        lg: ['15px', '24px'],
        xl: ['22px', '28px'],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
