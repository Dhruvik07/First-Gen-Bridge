"use client";

import { useState } from "react";
import StepForm, { type StepConfig } from "@/components/forms/StepForm";
import ResourceCard from "@/components/cards/ResourceCard";
import MentorCard from "@/components/cards/MentorCard";
import Icon from "@/components/common/Icon";
import type { Challenge } from "@/types/student";
import type { ResourceCard as ResourceCardType } from "@/types/resource";
import type { MentorProfile, CompatibilityScore } from "@/types/mentor";
import type { Channel } from "@/types/community";

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

const WORK_SCHEDULE_OPTIONS = [
  { value: "none", label: "Not working" },
  { value: "part_time", label: "Part-time" },
  { value: "full_time", label: "Full-time" },
];

/* ── Mock disability resources ── */
const DISABILITY_RESOURCES: ResourceCardType[] = [
  {
    id: "dr-1",
    institutionId: "inst-1",
    title: "Disability Resource Center",
    plainLanguageDescription:
      "A campus office that helps students with disabilities get the support they need, like extra test time or note-taking help.",
    intendedAudience: "Students with any type of disability",
    accessSteps: [
      "Visit the Disability Resource Center in Student Services Building, Room 120",
      "Bring documentation of your disability",
      "Meet with a coordinator to set up your accommodations",
    ],
    whatToExpect:
      "A private meeting where staff will listen to your needs and create a plan.",
    reviews: [
      { id: "r1", studentId: "s1", content: "They were so helpful and kind.", approved: true, createdAt: new Date() },
    ],
    availableLanguages: ["English", "Spanish"],
    tags: ["disability_specific", "accommodation_pathway"],
  },
  {
    id: "dr-2",
    institutionId: "inst-1",
    title: "Assistive Technology Lab",
    plainLanguageDescription:
      "A computer lab with special software and tools for students who need help reading, writing, or using a computer.",
    intendedAudience: "Students who need assistive technology",
    accessSteps: [
      "Go to the Library, 2nd floor, Room 210",
      "Show your student ID to check in",
      "Staff will help you find the right tools",
    ],
    whatToExpect:
      "Friendly staff will show you how to use screen readers, voice-to-text, and other tools.",
    reviews: [],
    availableLanguages: ["English"],
    tags: ["disability_specific"],
  },
];

/* ── Mock completion data ── */
const MOCK_MENTOR: MentorProfile = {
  userId: "m-1",
  verified: true,
  firstGenNarrative:
    "I was the first in my family to go to college. I know how confusing it can be to figure things out on your own. I'm here to help you navigate.",
  challengesOvercome: ["financial_hardship", "imposter_syndrome"],
  topicsAvailable: ["Financial Aid", "Study Skills", "Campus Life"],
  languagesSpoken: ["English", "Spanish"],
  educationalBackground: "B.A. Psychology, Class of 2022",
  expectedResponseTime: "24 hours",
  institutionId: "inst-1",
  averageRating: 4.8,
  trainingCompleted: true,
};

const MOCK_SCORE: CompatibilityScore = {
  total: 87,
  breakdown: {
    majorAlignment: 75,
    sharedChallenges: 95,
    culturalBackground: 90,
    languagePreference: 85,
    institutionFamiliarity: 80,
    personalizationOverlap: 88,
  },
};

const MOCK_CHANNELS: Channel[] = [
  { id: "ch-1", name: "First-Gen Support", category: "identity", description: "Connect with other first-gen students" },
  { id: "ch-2", name: "Financial Aid Tips", category: "challenge", description: "Share and find financial aid advice" },
  { id: "ch-3", name: "Campus Life", category: "major", description: "Talk about campus events and activities" },
];

const MOCK_RESOURCES: ResourceCardType[] = [
  {
    id: "res-1",
    institutionId: "inst-1",
    title: "Emergency Financial Aid",
    plainLanguageDescription: "Quick money help when you have an unexpected expense that could stop you from staying in school.",
    intendedAudience: "Any student facing a financial emergency",
    accessSteps: ["Visit Financial Aid Office", "Fill out the emergency aid form", "Meet with a counselor"],
    whatToExpect: "A short meeting to understand your situation. Funds can arrive in 3-5 days.",
    reviews: [],
    availableLanguages: ["English", "Spanish"],
    tags: ["crisis"],
  },
];

/* ── Shared input styles ── */
const inputClass =
  "w-full min-h-[44px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

const selectClass =
  "w-full min-h-[44px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

export default function OnboardingPage() {
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [showDisabilityResources, setShowDisabilityResources] = useState(false);

  const steps: StepConfig[] = [
    {
      id: "name",
      label: "What's your name?",
      description: "We'll use this to personalize your experience.",
      render: (value, onChange) => (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your full name"
          aria-label="Full name"
          className={inputClass}
        />
      ),
    },
    {
      id: "institution",
      label: "What school do you attend?",
      description: "This helps us find resources at your campus.",
      render: (value, onChange) => (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Arizona State University"
          aria-label="Institution name"
          className={inputClass}
        />
      ),
    },
    {
      id: "major",
      label: "What's your major?",
      description: "We'll connect you with mentors and peers in your field.",
      render: (value, onChange) => (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Computer Science"
          aria-label="Major"
          className={inputClass}
        />
      ),
    },
    {
      id: "language",
      label: "What language do you prefer?",
      description: "We'll show content in your preferred language when we can.",
      render: (value, onChange) => (
        <select
          value={(value as string) ?? "en"}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Preferred language"
          className={selectClass}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      id: "internationalStudent",
      label: "Are you an international student?",
      render: (value, onChange) => (
        <YesNoToggle value={value as boolean | undefined} onChange={onChange} id="international" />
      ),
    },
    {
      id: "parentingStatus",
      label: "Are you a parent or caregiver?",
      render: (value, onChange) => (
        <YesNoToggle value={value as boolean | undefined} onChange={onChange} id="parenting" />
      ),
    },
    {
      id: "workSchedule",
      label: "Do you work while in school?",
      render: (value, onChange) => (
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Work schedule">
          {WORK_SCHEDULE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                value === opt.value
                  ? "border-primary bg-primary-fixed text-on-primary-fixed"
                  : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <input
                type="radio"
                name="workSchedule"
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span className="text-body-md">{opt.label}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      id: "disabilityStatus",
      label: "Do you have a disability?",
      description: "This helps us show you the right support resources.",
      render: (value, onChange) => (
        <div>
          <YesNoToggle
            value={value as boolean | undefined}
            onChange={(val) => {
              onChange(val);
              if (val === true) setShowDisabilityResources(true);
              else setShowDisabilityResources(false);
            }}
            id="disability"
          />
          {showDisabilityResources && value === true && (
            <div className="mt-6">
              <h3 className="text-headline-md text-on-surface mb-3">
                <Icon name="accessibility_new" size={24} className="inline-block align-text-bottom mr-2" />
                Resources for you
              </h3>
              <p className="text-body-md text-on-surface-variant mb-4">
                Here are some resources at your campus that can help. You can always find more in the Resource Hub.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {DISABILITY_RESOURCES.map((res) => (
                  <ResourceCard key={res.id} resource={res} />
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "challenges",
      label: "What challenges are you facing?",
      description: "Pick all that apply. This helps us match you with the right mentors and resources.",
      render: (value, onChange) => {
        const selected = (value as Challenge[]) ?? [];
        const toggle = (c: Challenge) => {
          const next = selected.includes(c)
            ? selected.filter((x) => x !== c)
            : [...selected, c];
          onChange(next);
        };
        return (
          <div className="flex flex-col gap-2" role="group" aria-label="Challenges">
            {CHALLENGE_OPTIONS.map((opt) => {
              const isChecked = selected.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                    isChecked
                      ? "border-primary bg-primary-fixed text-on-primary-fixed"
                      : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(opt.value)}
                    className="sr-only"
                  />
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? "bg-primary border-primary" : "border-outline-variant bg-surface-container-lowest"
                    }`}
                    aria-hidden="true"
                  >
                    {isChecked && <Icon name="check" size={14} className="text-on-primary" />}
                  </span>
                  <span className="text-body-md">{opt.label}</span>
                </label>
              );
            })}
          </div>
        );
      },
    },
  ];

  function handleComplete(data: Record<string, unknown>) {
    setFormData(data);
    setCompleted(true);
    // Clear auto-save on completion
    try { localStorage.removeItem("fb-onboarding"); } catch { /* noop */ }
  }

  if (completed) {
    return <CompletionScreen data={formData} />;
  }

  return (
    <div className="flex-1 flex items-start justify-center p-sm lg:p-lg">
      <div className="w-full max-w-lg">
        <h1 className="text-headline-lg text-on-surface mb-2">Welcome to FirstBridge</h1>
        <p className="text-body-md text-on-surface-variant mb-8">
          Let&apos;s set up your profile so we can connect you with the right people and resources.
        </p>
        <StepForm
          steps={steps}
          onComplete={handleComplete}
          autoSaveKey="fb-onboarding"
        />
      </div>
    </div>
  );
}

/* ── Yes/No toggle ── */
function YesNoToggle({
  value,
  onChange,
  id,
}: {
  value: boolean | undefined;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex gap-3" role="radiogroup" aria-label={id}>
      {[
        { val: true, label: "Yes" },
        { val: false, label: "No" },
      ].map((opt) => (
        <label
          key={String(opt.val)}
          className={`flex-1 flex items-center justify-center min-h-[44px] px-4 py-3 rounded-lg border cursor-pointer transition-colors text-body-md font-semibold ${
            value === opt.val
              ? "border-primary bg-primary-fixed text-on-primary-fixed"
              : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
          }`}
        >
          <input
            type="radio"
            name={id}
            checked={value === opt.val}
            onChange={() => onChange(opt.val)}
            className="sr-only"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

/* ── Completion screen ── */
function CompletionScreen({ data }: { data: Record<string, unknown> }) {
  const name = (data.name as string) || "there";

  return (
    <div className="flex-1 p-sm lg:p-lg">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto mb-4">
            <Icon name="celebration" size={32} filled />
          </div>
          <h1 className="text-headline-lg text-on-surface mb-2">
            You&apos;re all set, {name}!
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Here&apos;s what we found for you based on your profile.
          </p>
        </div>

        {/* Recommended Mentor */}
        <section className="mb-8">
          <h2 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <Icon name="person" size={24} />
            Your recommended mentor
          </h2>
          <div className="max-w-md">
            <MentorCard mentor={MOCK_MENTOR} score={MOCK_SCORE} rank={1} isTopMatch />
          </div>
        </section>

        {/* Recommended Channels */}
        <section className="mb-8">
          <h2 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <Icon name="forum" size={24} />
            Channels for you
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {MOCK_CHANNELS.map((ch) => (
              <div
                key={ch.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:shadow-card-hover transition-all"
              >
                <p className="text-label-bold text-on-surface mb-1">{ch.name}</p>
                <p className="text-body-md text-on-surface-variant">{ch.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Resources */}
        <section>
          <h2 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <Icon name="library_books" size={24} />
            Resources to get started
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {MOCK_RESOURCES.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
