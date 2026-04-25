"use client";

import { useState } from "react";
import { useTheme, useAccessibility } from "@/components/layout/ThemeProvider";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import type { Challenge } from "@/types/student";

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
];

const CHALLENGE_OPTIONS: { value: Challenge; label: string }[] = [
  { value: "financial_hardship", label: "Financial hardship" },
  { value: "cultural_adjustment", label: "Cultural adjustment" },
  { value: "academic_preparedness", label: "Academic preparedness" },
  { value: "family_expectations", label: "Family expectations" },
  { value: "language_barrier", label: "Language barrier" },
  { value: "imposter_syndrome", label: "Imposter syndrome" },
];

const WORK_OPTIONS = [
  { value: "none", label: "Not working" },
  { value: "part_time", label: "Part-time" },
  { value: "full_time", label: "Full-time" },
];

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

const selectClass = inputClass;

export default function SettingsPage() {
  /* ── Profile state (mock defaults) ── */
  const [name, setName] = useState("Alex Johnson");
  const [institution, setInstitution] = useState("Arizona State University");
  const [major, setMajor] = useState("Computer Science");
  const [internationalStudent, setInternationalStudent] = useState(false);
  const [parentingStatus, setParentingStatus] = useState(false);
  const [workSchedule, setWorkSchedule] = useState("none");
  const [disabilityStatus, setDisabilityStatus] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>(["imposter_syndrome"]);

  /* ── Visibility state ── */
  const [profilePublic, setProfilePublic] = useState(true);
  const [showMajor, setShowMajor] = useState(true);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);

  /* ── Accessibility (shared hooks) ── */
  const { darkMode, toggleDarkMode } = useTheme();
  const { config, updateConfig } = useAccessibility();

  /* ── Delete account ── */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleChallenge = (c: Challenge) => {
    setChallenges((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  return (
    <div className="flex-1 p-sm lg:p-lg">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-headline-lg text-on-surface mb-2">Settings</h1>
        <p className="text-body-md text-on-surface-variant mb-8">
          Manage your profile, privacy, and accessibility preferences.
        </p>

        {/* ── Profile Section ── */}
        <section className="mb-8">
          <h2 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <Icon name="person" size={24} />
            Profile
          </h2>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-4">
            <Field label="Name" htmlFor="settings-name">
              <input id="settings-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Institution" htmlFor="settings-institution">
              <input id="settings-institution" type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Major" htmlFor="settings-major">
              <input id="settings-major" type="text" value={major} onChange={(e) => setMajor(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Work schedule" htmlFor="settings-work">
              <select id="settings-work" value={workSchedule} onChange={(e) => setWorkSchedule(e.target.value)} className={selectClass}>
                {WORK_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            <ToggleField label="International student" checked={internationalStudent} onChange={() => setInternationalStudent((p) => !p)} id="settings-intl" />
            <ToggleField label="Parent or caregiver" checked={parentingStatus} onChange={() => setParentingStatus((p) => !p)} id="settings-parent" />
            <ToggleField label="Disability status" checked={disabilityStatus} onChange={() => setDisabilityStatus((p) => !p)} id="settings-disability" />

            <div>
              <p className="text-label-bold text-on-surface mb-2">Challenges</p>
              <div className="flex flex-wrap gap-2">
                {CHALLENGE_OPTIONS.map((opt) => {
                  const active = challenges.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleChallenge(opt.value)}
                      aria-pressed={active}
                      className={`min-h-[44px] px-4 py-2 rounded-full border text-label-bold transition-colors ${
                        active
                          ? "border-primary bg-primary-fixed text-on-primary-fixed"
                          : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" icon="save">Save profile</Button>
            </div>
          </div>
        </section>

        {/* ── Visibility Section ── */}
        <section className="mb-8">
          <h2 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <Icon name="visibility" size={24} />
            Visibility
          </h2>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-1">
            <ToggleField label="Public profile" checked={profilePublic} onChange={() => setProfilePublic((p) => !p)} id="vis-public" />
            <ToggleField label="Show major" checked={showMajor} onChange={() => setShowMajor((p) => !p)} id="vis-major" />
            <ToggleField label="Show challenges" checked={showChallenges} onChange={() => setShowChallenges((p) => !p)} id="vis-challenges" />
            <ToggleField label="Show identity" checked={showIdentity} onChange={() => setShowIdentity((p) => !p)} id="vis-identity" />
          </div>
        </section>

        {/* ── Accessibility Section ── */}
        <section className="mb-8">
          <h2 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <Icon name="accessibility_new" size={24} />
            Accessibility
          </h2>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md space-y-1">
            <ToggleField label="Dark mode" checked={darkMode} onChange={toggleDarkMode} id="a11y-dark" />
            <ToggleField label="High contrast" checked={config.highContrast} onChange={() => updateConfig({ highContrast: !config.highContrast })} id="a11y-contrast" />
            <ToggleField
              label="OpenDyslexic font"
              checked={config.fontFamily === "opendyslexic"}
              onChange={() => updateConfig({ fontFamily: config.fontFamily === "opendyslexic" ? "default" : "opendyslexic" })}
              id="a11y-font"
            />

            {/* Text size */}
            <div className="flex items-center justify-between py-3 border-b border-outline-variant">
              <span className="text-label-bold text-on-surface">Text size</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateConfig({ textSizePercent: Math.max(100, config.textSizePercent - 10) })}
                  disabled={config.textSizePercent <= 100}
                  aria-label="Decrease text size"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="remove" size={20} />
                </button>
                <span className="text-label-bold text-on-surface w-12 text-center tabular-nums" aria-live="polite">
                  {config.textSizePercent}%
                </span>
                <button
                  type="button"
                  onClick={() => updateConfig({ textSizePercent: Math.min(200, config.textSizePercent + 10) })}
                  disabled={config.textSizePercent >= 200}
                  aria-label="Increase text size"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="add" size={20} />
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between py-3">
              <label htmlFor="a11y-lang-settings" className="text-label-bold text-on-surface">Language</label>
              <select
                id="a11y-lang-settings"
                value={config.preferredLanguage}
                onChange={(e) => updateConfig({ preferredLanguage: e.target.value })}
                className="min-h-[44px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface px-3 py-2 text-label-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── Account Section ── */}
        <section className="mb-8">
          <h2 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <Icon name="manage_accounts" size={24} />
            Account
          </h2>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            {!showDeleteConfirm ? (
              <Button variant="outline" icon="delete" onClick={() => setShowDeleteConfirm(true)}>
                Delete account
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-body-md text-error">
                  Are you sure? This will permanently delete your account and all your data within 30 days. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                  <Button variant="primary" icon="delete" className="bg-error hover:bg-error/90 text-on-error">
                    Yes, delete my account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Helper components ── */

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-label-bold text-on-surface mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function ToggleField({ label, checked, onChange, id }: { label: string; checked: boolean; onChange: () => void; id: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-outline-variant">
      <label htmlFor={id} className="text-label-bold text-on-surface">{label}</label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-outline-variant"}`}>
          <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
        </span>
      </button>
    </div>
  );
}
