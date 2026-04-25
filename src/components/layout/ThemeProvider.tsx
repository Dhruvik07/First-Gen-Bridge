"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AccessibilityConfig } from "@/types/accessibility";

interface ThemeContextValue {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

interface AccessibilityContextValue {
  config: AccessibilityConfig;
  updateConfig: (updates: Partial<AccessibilityConfig>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null
);

const DEFAULT_ACCESSIBILITY: AccessibilityConfig = {
  highContrast: false,
  fontFamily: "default",
  textSizePercent: 100,
  preferredLanguage: "en",
  voiceInputEnabled: false,
};

function getStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [a11y, setA11y] = useState<AccessibilityConfig>(DEFAULT_ACCESSIBILITY);
  const [mounted, setMounted] = useState(false);

  // Read persisted preferences on mount
  useEffect(() => {
    setDarkMode(getStoredValue("fb-dark-mode", false));
    setA11y(getStoredValue("fb-accessibility", DEFAULT_ACCESSIBILITY));
    setMounted(true);
  }, []);

  // Apply dark mode class to <html>
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.classList.toggle("dark", darkMode);
    localStorage.setItem("fb-dark-mode", JSON.stringify(darkMode));
  }, [darkMode, mounted]);

  // Apply accessibility preferences
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;

    // High contrast
    html.classList.toggle("high-contrast", a11y.highContrast);

    // Font family
    if (a11y.fontFamily === "opendyslexic") {
      html.classList.add("font-opendyslexic");
    } else {
      html.classList.remove("font-opendyslexic");
    }

    // Text size
    html.style.fontSize = `${a11y.textSizePercent}%`;

    localStorage.setItem("fb-accessibility", JSON.stringify(a11y));
  }, [a11y, mounted]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const updateConfig = useCallback((updates: Partial<AccessibilityConfig>) => {
    setA11y((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <ThemeContext value={{ darkMode, toggleDarkMode }}>
      <AccessibilityContext value={{ config: a11y, updateConfig }}>
        {children}
      </AccessibilityContext>
    </ThemeContext>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within a ThemeProvider");
  }
  return ctx;
}
