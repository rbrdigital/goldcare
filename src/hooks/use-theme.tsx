import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      if (stored) return stored;
      return "light"; // Always default to light instead of system preference
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme
    root.removeAttribute("data-theme");
    
    // Apply new theme
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    }
    
    // Store preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return { theme, toggleTheme };
}