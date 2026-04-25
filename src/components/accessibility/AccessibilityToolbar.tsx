"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme, useAccessibility } from "@/components/layout/ThemeProvider";
import Icon from "@/components/common/Icon";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "ko", label: "한국어" },
  { code: "tl", label: "Tagalog" },
] as const;

const MIN_TEXT_SIZE = 100;
const MAX_TEXT_SIZE = 200;
const TEXT_SIZE_STEP = 10;

export default function AccessibilityToolbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { config, updateConfig } = useAccessibility();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const decreaseSize = () => {
    const next = Math.max(MIN_TEXT_SIZE, config.textSizePercent - TEXT_SIZE_STEP);
    updateConfig({ textSizePercent: next });
  };

  const increaseSize = () => {
    const next = Math.min(MAX_TEXT_SIZE, config.textSizePercent + TEXT_SIZE_STEP);
    updateConfig({ textSizePercent: next });
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Accessibility settings"
        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary dark:text-primary hover:bg-surface-container-high transition-colors p-2 rounded-full active:opacity-80"
      >
        <Icon name="accessibility_new" />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility settings panel"
          className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-md z-50"
        >
          {/* Dark mode */}
          <ToggleRow
            label="Dark mode"
            checked={darkMode}
            onChange={toggleDarkMode}
            id="a11y-dark-mode"
          />

          {/* High contrast */}
          <ToggleRow
            label="High contrast"
            checked={config.highContrast}
            onChange={() => updateConfig({ highContrast: !config.highContrast })}
            id="a11y-high-contrast"
          />

          {/* OpenDyslexic font */}
          <ToggleRow
            label="OpenDyslexic font"
            checked={config.fontFamily === "opendyslexic"}
            onChange={() =>
              updateConfig({
                fontFamily: config.fontFamily === "opendyslexic" ? "default" : "opendyslexic",
              })
            }
            id="a11y-dyslexic-font"
          />

          {/* Text size */}
          <div className="flex items-center justify-between py-2 border-b border-outline-variant">
            <span className="text-label-bold text-on-surface">Text size</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decreaseSize}
                disabled={config.textSizePercent <= MIN_TEXT_SIZE}
                aria-label="Decrease text size"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="remove" size={20} />
              </button>
              <span
                className="text-label-bold text-on-surface w-12 text-center tabular-nums"
                aria-live="polite"
              >
                {config.textSizePercent}%
              </span>
              <button
                type="button"
                onClick={increaseSize}
                disabled={config.textSizePercent >= MAX_TEXT_SIZE}
                aria-label="Increase text size"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="add" size={20} />
              </button>
            </div>
          </div>

          {/* Language selector */}
          <div className="flex items-center justify-between py-2">
            <label
              htmlFor="a11y-language"
              className="text-label-bold text-on-surface"
            >
              Language
            </label>
            <select
              id="a11y-language"
              value={config.preferredLanguage}
              onChange={(e) => updateConfig({ preferredLanguage: e.target.value })}
              aria-label="Select preferred language"
              className="min-h-[44px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface px-3 py-2 text-label-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Toggle row sub-component ── */

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  id: string;
}

function ToggleRow({ label, checked, onChange, id }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-outline-variant">
      <label htmlFor={id} className="text-label-bold text-on-surface">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <span
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            checked ? "bg-primary" : "bg-outline-variant"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              checked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </span>
      </button>
    </div>
  );
}
