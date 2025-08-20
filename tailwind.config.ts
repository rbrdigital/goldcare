
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
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        fg: "var(--color-fg)",
        "fg-muted": "var(--color-fg-muted)",
        primary: "var(--color-primary)",
        "primary-fg": "var(--color-primary-fg)",
        "on-primary": "var(--color-on-primary)",
        secondary: "var(--color-secondary)",
        "secondary-fg": "var(--color-secondary-fg)",
        "button-primary": "var(--color-button-primary)",
        "button-primary-text": "var(--color-button-primary-text)",
        success: "var(--color-success)",
        "success-fg": "var(--color-success-fg)",
        danger: "var(--color-danger)",
        "danger-fg": "var(--color-danger-fg)",
        warning: "var(--color-warning)",
        "warning-fg": "var(--color-warning-fg)",
        "medical-blue": "var(--color-medical-blue)",
        "medical-blue-light": "var(--color-medical-blue-light)",
        "medical-green": "var(--color-medical-green)",
        "medical-green-light": "var(--color-medical-green-light)",
        "medical-amber": "var(--color-medical-amber)",
        "medical-amber-light": "var(--color-medical-amber-light)",
        "medical-red": "var(--color-medical-red)",
        "medical-red-light": "var(--color-medical-red-light)",
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
        DEFAULT: "var(--radius-md)",
        lg: "var(--radius-lg)",
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
