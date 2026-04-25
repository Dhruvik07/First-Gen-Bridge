"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/common/Icon";

export interface VoiceOverlayProps {
  onClose: () => void;
}

export default function VoiceOverlay({ onClose }: VoiceOverlayProps) {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [aiCaption, setAiCaption] = useState("");

  // Simulate transcription updates
  useEffect(() => {
    if (!isListening) return;

    const phrases = [
      "I need help with...",
      "I need help with my email...",
      "I need help with my email to my professor...",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < phrases.length) {
        setTranscript(phrases[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setIsListening(false);
        setAiCaption(
          "I can help you with that! Let's start by thinking about what you want to say..."
        );
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isListening]);

  function handleTapToStop() {
    setIsListening(false);
    setAiCaption("");
  }

  function handleSwitchToText() {
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-6"
      role="dialog"
      aria-label="Voice conversation mode"
      aria-modal="true"
    >
      {/* Close / switch to text */}
      <div className="absolute top-6 right-6 flex gap-3">
        <button
          onClick={handleSwitchToText}
          className="flex items-center gap-2 bg-surface text-on-surface rounded-full px-4 py-2 text-label-bold hover:bg-surface-container-high transition-colors min-h-[44px]"
        >
          <Icon name="keyboard" size={18} />
          Switch to text
        </button>
      </div>

      {/* Pulsing microphone indicator */}
      <div className="relative mb-8">
        {isListening && (
          <>
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary-container opacity-20 animate-ping" />
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary-container opacity-10 animate-pulse" />
          </>
        )}
        <button
          onClick={isListening ? handleTapToStop : () => setIsListening(true)}
          className={[
            "relative w-32 h-32 rounded-full flex items-center justify-center transition-colors",
            isListening
              ? "bg-primary-container text-white"
              : "bg-surface-variant text-on-surface-variant",
          ].join(" ")}
          aria-label={isListening ? "Tap to stop listening" : "Tap to start listening"}
        >
          <Icon name={isListening ? "mic" : "mic_off"} size={48} filled />
        </button>
      </div>

      {/* Status text */}
      <p className="text-white text-body-md mb-6">
        {isListening ? "Listening... Tap to stop" : "Tap microphone to speak"}
      </p>

      {/* Real-time transcription display */}
      {transcript && (
        <div className="w-full max-w-lg mb-4">
          <p className="text-label-sm text-white/60 mb-1">You said:</p>
          <div className="bg-white/10 rounded-xl p-4 text-white text-body-md">
            {transcript}
          </div>
        </div>
      )}

      {/* AI speech captions */}
      {aiCaption && (
        <div className="w-full max-w-lg mb-4">
          <p className="text-label-sm text-white/60 mb-1">AI Coach:</p>
          <div className="bg-primary-container/30 rounded-xl p-4 text-white text-body-md">
            {aiCaption}
          </div>
        </div>
      )}
    </div>
  );
}
