
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
        primary: "var(--primary)",        /* Blue - text only */
        "primary-50": "var(--primary-50)",    /* Light gray */
        "primary-100": "var(--primary-100)",  /* Darker gray */
        "primary/30": "var(--primary-30a)",   /* 10% black */
        "medical-blue": "var(--medical-blue)",      /* Black */
        "medical-blue-light": "var(--medical-blue-light)", /* Light gray */
        "medical-green": "var(--medical-green)",
        "medical-green-light": "var(--medical-green-light)",
        "medical-amber": "var(--medical-amber)",
        "medical-amber-light": "var(--medical-amber-light)",
        "medical-red": "var(--medical-red)",
        "medical-red-light": "var(--medical-red-light)",
        
        // Gold tokens
        "gc-gold-700": "var(--gc-gold-700)",
        "gc-gold-600": "var(--gc-gold-600)",
        "gc-gold-500": "var(--gc-gold-500)",
        "gc-gold-400": "var(--gc-gold-400)",
        "gc-gold-300": "var(--gc-gold-300)",
        "gc-gold-bg": "var(--gc-gold-bg)",
        "gc-gold-bg-hover": "var(--gc-gold-bg-hover)",
        "gc-gold-ring": "var(--gc-gold-ring)",
        
        // Legacy tokens for backward compatibility
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
        },
        // AI Glow effects - subtle and medical-appropriate
        'ai-glow': {
          '0%, 100%': {
            boxShadow: '0 0 8px hsl(var(--primary) / 0.15), 0 0 16px hsl(var(--primary) / 0.1), inset 0 1px 0 hsl(var(--primary) / 0.1)'
          },
          '50%': {
            boxShadow: '0 0 12px hsl(var(--primary) / 0.25), 0 0 24px hsl(var(--primary) / 0.15), inset 0 1px 0 hsl(var(--primary) / 0.15)'
          }
        },
        'ai-glow-hover': {
          '0%, 100%': {
            boxShadow: '0 0 12px hsl(var(--primary) / 0.25), 0 0 24px hsl(var(--primary) / 0.15), inset 0 1px 0 hsl(var(--primary) / 0.15)'
          },
          '50%': {
            boxShadow: '0 0 16px hsl(var(--primary) / 0.35), 0 0 32px hsl(var(--primary) / 0.2), inset 0 1px 0 hsl(var(--primary) / 0.2)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // AI Glow animations - gentle and professional
        'ai-glow': 'ai-glow 3s ease-in-out infinite',
        'ai-glow-hover': 'ai-glow-hover 2s ease-in-out infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
