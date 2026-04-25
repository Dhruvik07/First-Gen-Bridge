"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/common/Icon";

const MOCK_NAME = "Alex";

const MOOD_OPTIONS = [
  { key: "struggling", icon: "sentiment_dissatisfied", label: "Struggling", color: "text-error" },
  { key: "managing", icon: "sentiment_neutral", label: "Managing", color: "text-secondary-container" },
  { key: "great", icon: "sentiment_very_satisfied", label: "Great", color: "text-primary" },
] as const;

const COMMUNITY_WINS = [
  {
    icon: "workspace_premium",
    iconColor: "text-secondary-fixed-dim",
    category: "First Generation",
    quote: "Finally understood the financial aid process and got my forms submitted early!",
    author: "Maria G., Freshman",
  },
  {
    icon: "school",
    iconColor: "text-primary-container",
    category: "Academic Success",
    quote: "Aced my first mid-term in Calc 101. The study groups really paid off.",
    author: "David T., Sophomore",
  },
  {
    icon: "handshake",
    iconColor: "text-secondary-fixed-dim",
    category: "Career Prep",
    quote: "Secured a summer internship after practicing mock interviews with my AI Coach.",
    author: "Sam L., Junior",
  },
];

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <main className="flex-1 p-6 md:p-8 lg:p-10 pb-32 md:pb-10 max-w-[1200px] mx-auto w-full flex flex-col gap-lg">
      {/* Welcome Header */}
      <div className="flex flex-col gap-xs">
        <h1 className="text-headline-lg text-on-surface">
          Good Morning, {MOCK_NAME}
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Here is your daily overview to keep you on track.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
        {/* Weekly Check-in (Span 8) */}
        <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <h2 className="text-headline-md text-on-surface">Weekly Check-in</h2>
            <span className="px-3 py-1 bg-primary-container text-on-primary-container text-label-bold rounded-full">
              Due Today
            </span>
          </div>
          <p className="text-body-md text-on-surface-variant">
            How are you feeling about your academic workload this week?
          </p>
          <div className="flex flex-wrap gap-sm mt-2">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = selectedMood === mood.key;
              return (
                <button
                  key={mood.key}
                  type="button"
                  onClick={() => setSelectedMood(mood.key)}
                  aria-pressed={isSelected}
                  aria-label={mood.label}
                  className={[
                    "flex-1 py-3 px-4 rounded-lg flex flex-col items-center gap-2 transition-colors min-h-[44px]",
                    isSelected
                      ? "border-2 border-primary-container bg-surface-container-lowest"
                      : "border border-outline-variant hover:bg-surface-container",
                  ].join(" ")}
                >
                  <Icon
                    name={mood.icon}
                    size={32}
                    className={isSelected ? "text-primary" : mood.color}
                  />
                  <span
                    className={[
                      "text-label-sm",
                      isSelected ? "font-bold text-primary" : "",
                    ].join(" ")}
                  >
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="bg-primary-container text-on-primary text-label-bold py-2 px-4 rounded-lg hover:bg-primary transition-colors min-h-[44px]"
            >
              Submit Check-in
            </button>
          </div>
        </div>

        {/* Next Meeting (Span 4) */}
        <div className="md:col-span-4 bg-secondary-container rounded-xl p-md flex flex-col justify-between border border-secondary relative overflow-hidden">
          {/* Decorative background icon */}
          <div className="absolute -right-6 -top-6 text-secondary opacity-20">
            <Icon name="calendar_month" size={96} />
          </div>

          <div className="relative z-10">
            <h2 className="text-headline-md text-on-secondary-container mb-xs">
              Next Meeting
            </h2>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-on-secondary-container bg-on-secondary-container/10 flex items-center justify-center shrink-0">
                <Icon name="person" size={24} className="text-on-secondary-container" />
              </div>
              <div>
                <p className="text-label-bold text-on-secondary-container">
                  Dr. Sarah Jenkins
                </p>
                <p className="text-label-sm text-on-secondary-container opacity-80">
                  Academic Mentor
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-white/40 backdrop-blur-sm rounded-lg p-3 mt-4 border border-secondary/30">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="schedule" size={16} className="text-on-secondary-container" />
              <p className="text-label-bold text-on-secondary-container">
                Tomorrow, 2:00 PM
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="videocam" size={16} className="text-on-secondary-container" />
              <p className="text-label-sm text-on-secondary-container">
                Zoom Link
              </p>
            </div>
          </div>
        </div>

        {/* Community Wins (Span 12) */}
        <div className="md:col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-md mt-sm">
          <div className="flex justify-between items-center mb-md">
            <h2 className="text-headline-md text-on-surface">Community Wins</h2>
            <Link
              href="/community/win-board"
              className="text-label-bold text-primary hover:underline min-h-[44px] flex items-center"
            >
              View Win Board
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMMUNITY_WINS.map((win) => (
              <div
                key={win.author}
                className="p-4 rounded-lg border border-surface-variant bg-surface flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    name={win.icon}
                    size={24}
                    filled
                    className={win.iconColor}
                  />
                  <span className="text-label-bold">{win.category}</span>
                </div>
                <p className="text-body-md text-on-surface-variant line-clamp-2">
                  &ldquo;{win.quote}&rdquo;
                </p>
                <p className="text-label-sm text-tertiary-container mt-auto pt-2">
                  — {win.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
