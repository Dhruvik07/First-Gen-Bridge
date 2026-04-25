"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import VoiceButton from "@/components/chat/VoiceButton";
import Icon from "@/components/common/Icon";
import type { AIMessage, CommunicationScenario } from "@/types/ai";

const STEPS = [
  { number: 1, label: "Identify Goal" },
  { number: 2, label: "Recipient Tone" },
  { number: 3, label: "Draft Content" },
  { number: 4, label: "Review & Edit" },
  { number: 5, label: "Final Polish" },
];

const SCENARIOS: { key: CommunicationScenario; title: string; description: string; icon: string }[] = [
  { key: "email_professor", title: "Email a Professor", description: "Write a clear, professional email to your instructor", icon: "school" },
  { key: "request_accommodation", title: "Request Accommodation", description: "Ask for the support you need from disability services", icon: "accessibility" },
  { key: "apply_research", title: "Apply for Research", description: "Reach out to a professor about research opportunities", icon: "science" },
  { key: "negotiate_deadline", title: "Negotiate a Deadline", description: "Ask for an extension on an assignment", icon: "schedule" },
];

const STEP_PROMPTS: Record<number, string> = {
  1: "Let's start by identifying your goal. Who are you writing to, and what do you want to accomplish with this email?",
  2: "Now let's think about tone. How formal should this be? What's your relationship with this person like?",
  3: "Time to draft! Based on what you've told me, try writing the main body of your email. Don't worry about making it perfect — just get your thoughts down.",
  4: "Let's review your draft together. I'll point out areas that could be stronger. Read through it — does anything feel unclear or too long?",
  5: "Almost done! Let's do a final polish. Check the greeting, sign-off, and subject line. Does everything feel right?",
};

export default function CommunicationCoachPage() {
  const [scenario, setScenario] = useState<CommunicationScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [draftMode, setDraftMode] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // TODO: Replace local state with API-backed session via POST to communication-coach service
  // TODO: Call startSession(studentId, scenario) on scenario selection
  // TODO: Call submitStepInput(sessionId, stepNumber, input) on each step submission
  // TODO: Call getConsolidatedDraft(sessionId) when all steps complete
  // TODO: Call editDraft(sessionId, edits) when user edits the draft
  // TODO: Save completed drafts to Confidence Archive via POST /api/archive

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function selectScenario(key: CommunicationScenario) {
    setScenario(key);
    const scenarioLabel = SCENARIOS.find((s) => s.key === key)?.title ?? key;
    const welcomeMsg: AIMessage = {
      role: "guide",
      content: `Great choice! Let's work on "${scenarioLabel}" together. I'll walk you through 5 steps to help you write this from your own words — no templates here.`,
      timestamp: new Date(),
    };
    const stepMsg: AIMessage = {
      role: "guide",
      content: STEP_PROMPTS[1],
      timestamp: new Date(),
    };
    setMessages([welcomeMsg, stepMsg]);
    setCurrentStep(1);
  }

  function handleSend(text: string) {
    const studentMsg: AIMessage = { role: "student", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, studentMsg]);

    // TODO: Replace mock step progression with submitStepInput API call
    // Simulate step progression
    setTimeout(() => {
      if (currentStep < 5) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        const guideMsg: AIMessage = {
          role: "guide",
          content: STEP_PROMPTS[nextStep],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, guideMsg]);
      } else {
        // Step 5 complete — show consolidated draft
        setDraftMode(true);
        setDraftContent(
          `Subject: Request Regarding [Topic]\n\nDear Professor [Name],\n\n${text}\n\nI appreciate your time and guidance.\n\nBest regards,\n[Your Name]`
        );
        const guideMsg: AIMessage = {
          role: "guide",
          content: "Excellent work! I've put together a consolidated draft based on everything you wrote. You can edit it below, and save it to your archive when you're happy with it.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, guideMsg]);
      }
    }, 600);
  }

  function handleStartOver() {
    setScenario(null);
    setCurrentStep(1);
    setMessages([]);
    setDraftMode(false);
    setDraftContent("");
  }

  function handleSaveToArchive() {
    alert("Draft saved to your Confidence Archive!");
  }

  // Step sidebar component
  function StepSidebar() {
    return (
      <div className="w-64 bg-surface border-r border-[#E0E0E0] flex-col p-6 overflow-y-auto hidden md:flex">
        <h2 className="text-headline-md text-on-surface mb-6">Email Coach</h2>
        <div className="flex-1 space-y-0">
          {STEPS.map((step, idx) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <div key={step.number} className="flex items-start gap-3">
                {/* Step circle + connecting line */}
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center text-label-bold shrink-0",
                      isCompleted
                        ? "bg-primary text-on-primary"
                        : isActive
                        ? "bg-primary-container text-on-primary"
                        : "bg-surface-variant text-on-surface-variant border border-[#E0E0E0] opacity-60",
                    ].join(" ")}
                  >
                    {isCompleted ? (
                      <Icon name="check" size={16} />
                    ) : (
                      step.number
                    )}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={[
                        "w-0.5 h-8",
                        isCompleted ? "bg-primary" : "bg-[#E0E0E0]",
                      ].join(" ")}
                    />
                  )}
                </div>
                {/* Step label */}
                <p
                  className={[
                    "text-label-bold pt-1",
                    isActive ? "text-on-surface" : isUpcoming ? "text-on-surface-variant opacity-60" : "text-on-surface-variant",
                  ].join(" ")}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleStartOver}
          className="mt-6 flex items-center gap-2 text-label-bold text-primary-container hover:underline min-h-[44px]"
        >
          <Icon name="restart_alt" size={18} />
          Start Over
        </button>
      </div>
    );
  }

  // Mobile step indicator
  function MobileStepIndicator() {
    return (
      <div className="md:hidden border-b border-[#E0E0E0] bg-surface-container-lowest px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-label-bold text-on-surface">Email Coach</h2>
          <div className="flex items-center gap-1">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className={[
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                  step.number < currentStep
                    ? "bg-primary text-on-primary"
                    : step.number === currentStep
                    ? "bg-primary-container text-white"
                    : "bg-surface-variant text-on-surface-variant border border-[#E0E0E0] opacity-60",
                ].join(" ")}
              >
                {step.number < currentStep ? (
                  <Icon name="check" size={12} />
                ) : (
                  step.number
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleStartOver}
            className="text-label-sm text-primary-container hover:underline min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Icon name="restart_alt" size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Scenario selection view
  if (!scenario) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <h1 className="text-headline-lg text-on-surface mb-2 text-center">Communication Coach</h1>
          <p className="text-body-md text-on-surface-variant mb-8 text-center">
            Choose a scenario and I&apos;ll guide you through writing it step by step — using your own words.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCENARIOS.map((s) => (
              <button
                key={s.key}
                onClick={() => selectScenario(s.key)}
                className="border border-[#E0E0E0] rounded-lg p-6 hover:border-primary-container cursor-pointer text-left transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center mb-3">
                  <Icon name={s.icon} size={20} />
                </div>
                <h3 className="text-label-bold text-on-surface group-hover:text-primary-container transition-colors mb-1">
                  {s.title}
                </h3>
                <p className="text-label-sm text-on-surface-variant">{s.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0">
      {/* Desktop step sidebar */}
      <StepSidebar />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile step indicator */}
        <MobileStepIndicator />

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}

          {/* Consolidated draft view */}
          {draftMode && (
            <div className="max-w-3xl mx-auto">
              <div className="border border-[#E0E0E0] rounded-xl p-6 bg-surface-container-lowest">
                <h3 className="text-label-bold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="description" size={20} className="text-primary-container" />
                  Your Draft
                </h3>
                <textarea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full min-h-[200px] bg-white border border-[#E0E0E0] rounded-lg p-4 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-y"
                  aria-label="Edit your draft"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSaveToArchive}
                    className="flex items-center gap-2 bg-primary-container text-white rounded-lg px-6 py-3 text-label-bold hover:bg-primary transition-colors min-h-[44px]"
                  >
                    <Icon name="archive" size={18} />
                    Save to Archive
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Sticky bottom input */}
        {!draftMode && (
          <div className="border-t border-[#E0E0E0] bg-surface-container-lowest p-4 md:p-6 sticky bottom-0">
            <div className="max-w-3xl mx-auto flex items-end gap-2">
              <VoiceButton active={voiceActive} onToggle={() => setVoiceActive(!voiceActive)} />
              <div className="flex-1">
                <ChatInput onSend={handleSend} placeholder="Type your response..." />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
