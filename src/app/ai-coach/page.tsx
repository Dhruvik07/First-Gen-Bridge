"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import VoiceButton from "@/components/chat/VoiceButton";
import VoiceOverlay from "@/components/chat/VoiceOverlay";
import Icon from "@/components/common/Icon";
import type { AIMessage, AIMode } from "@/types/ai";

const MODES: { key: AIMode | "communication_coach_link"; label: string; icon: string; href?: string }[] = [
  { key: "communication_coach_link", label: "Communication Coach", icon: "edit_note", href: "/ai-coach/communication" },
  { key: "academic_navigation", label: "Academic Navigation", icon: "school" },
  { key: "emotional_processing", label: "Emotional Processing", icon: "psychology" },
  { key: "unspoken_rules", label: "Unspoken Rules", icon: "lightbulb" },
];

const QUICK_REPLIES = [
  "How do I email my professor about a late assignment?",
  "What are office hours really for?",
  "I feel like I don't belong here",
  "Help me understand financial aid",
];

const OPTION_CARDS = [
  { title: "Email a Professor", description: "Get help writing a professional email", icon: "mail" },
  { title: "Navigate Office Hours", description: "Learn what to expect and how to prepare", icon: "event" },
  { title: "Understand Financial Aid", description: "Break down confusing aid terminology", icon: "payments" },
  { title: "Handle Group Projects", description: "Tips for working with classmates", icon: "groups" },
];

const MOCK_MESSAGES: AIMessage[] = [
  {
    role: "guide",
    content: "Hi there! I'm your AI Coach. I can help you navigate college life — from writing emails to understanding unspoken rules. What would you like to work on today?",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    role: "student",
    content: "I need to visit my professor's office hours but I don't know what to expect.",
    timestamp: new Date(Date.now() - 90000),
  },
  {
    role: "guide",
    content: "Great question! Office hours can feel intimidating at first, but they're really just a time your professor sets aside to help students. Let me ask you a few things to help you prepare. What class is this for, and is there a specific topic or assignment you want to discuss?",
    timestamp: new Date(Date.now() - 60000),
  },
];

export default function AICoachPage() {
  const [activeMode, setActiveMode] = useState<AIMode>("academic_navigation");
  const [messages, setMessages] = useState<AIMessage[]>(MOCK_MESSAGES);
  const [voiceActive, setVoiceActive] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // TODO: Replace MOCK_MESSAGES with real conversation state from API
  // TODO: Call POST /api/ai/message with { conversationId, message, mode, language } on send
  // TODO: Use crisis detection from API response to show/hide crisis banner
  // TODO: Persist conversation ID in state and create new conversation on mode switch

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(text: string) {
    const studentMsg: AIMessage = {
      role: "student",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, studentMsg]);

    // Check for crisis keywords (mock detection)
    const crisisWords = ["suicide", "hurt myself", "end it all", "self-harm"];
    if (crisisWords.some((w) => text.toLowerCase().includes(w))) {
      setShowCrisisBanner(true);
    }

    // TODO: Replace mock response with POST /api/ai/message call
    // TODO: Use AIResponse.crisisDetection to trigger crisis banner
    // Mock AI response
    setTimeout(() => {
      const guideMsg: AIMessage = {
        role: "guide",
        content: "That's a great point. Let me help you think through that step by step. Can you tell me more about what specifically feels challenging?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, guideMsg]);
    }, 800);
  }

  function handleQuickReply(text: string) {
    handleSend(text);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Mode selector */}
      <div className="border-b border-[#E0E0E0] bg-surface-container-lowest px-4 py-3">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
          {MODES.map((mode) =>
            mode.href ? (
              <Link
                key={mode.key}
                href={mode.href}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-label-sm font-medium transition-colors bg-surface-container-high text-on-surface hover:bg-surface-container-highest min-h-[44px]"
              >
                <Icon name={mode.icon} size={16} />
                {mode.label}
              </Link>
            ) : (
              <button
                key={mode.key}
                onClick={() => setActiveMode(mode.key as AIMode)}
                className={[
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-label-sm font-medium transition-colors min-h-[44px]",
                  activeMode === mode.key
                    ? "bg-primary-container text-white"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
                ].join(" ")}
              >
                <Icon name={mode.icon} size={16} />
                {mode.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Crisis resource banner */}
      {showCrisisBanner && (
        <div className="bg-error-container text-on-error-container rounded-xl p-md mx-4 mt-4" role="alert">
          <div className="flex items-start gap-3">
            <Icon name="emergency" size={24} filled />
            <div className="flex-1">
              <p className="font-semibold text-body-md mb-1">You are not alone. Help is available.</p>
              <p className="text-label-bold">
                988 Suicide &amp; Crisis Lifeline: Call or text <strong>988</strong>
              </p>
              <p className="text-label-sm mt-1">
                Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong>
              </p>
            </div>
            <button
              onClick={() => setShowCrisisBanner(false)}
              className="rounded-lg px-4 py-2 bg-on-error-container text-error-container text-label-bold min-h-[44px] hover:opacity-90 transition-opacity"
            >
              I understand
            </button>
          </div>
        </div>
      )}

      {/* Chat message area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Option cards (shown after initial AI message) */}
        {messages.length <= 3 && (
          <div className="max-w-3xl mx-auto">
            <p className="text-label-bold text-on-surface-variant mb-3">Choose a topic to explore:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OPTION_CARDS.map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleSend(`I'd like help with: ${card.title}`)}
                  className="border border-[#E0E0E0] rounded-lg p-4 hover:border-primary-container cursor-pointer text-left transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={card.icon} size={20} className="text-primary-container" />
                    <span className="text-label-bold text-on-surface group-hover:text-primary-container transition-colors">
                      {card.title}
                    </span>
                  </div>
                  <p className="text-label-sm text-on-surface-variant">{card.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick-reply chips */}
        {messages.length <= 3 && (
          <div className="max-w-3xl mx-auto">
            <p className="text-label-bold text-on-surface-variant mb-2">Or try asking:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((text) => (
                <button
                  key={text}
                  onClick={() => handleQuickReply(text)}
                  className="bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-2 text-label-sm hover:opacity-90 transition-opacity min-h-[44px]"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Sticky bottom input */}
      <div className="border-t border-[#E0E0E0] bg-surface-container-lowest p-4 md:p-6 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <VoiceButton active={voiceActive} onToggle={() => setVoiceActive(!voiceActive)} />
          <div className="flex-1">
            <ChatInput onSend={handleSend} placeholder="Ask your AI Coach anything..." />
          </div>
        </div>
      </div>

      {/* Voice overlay */}
      {voiceActive && (
        <VoiceOverlay onClose={() => setVoiceActive(false)} />
      )}
    </div>
  );
}
