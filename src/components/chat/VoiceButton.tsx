"use client";

import Icon from "@/components/common/Icon";

export interface VoiceButtonProps {
  active?: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function VoiceButton({
  active = false,
  onToggle,
  disabled = false,
}: VoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={active ? "Stop voice input" : "Start voice input"}
      className={[
        "min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        active
          ? "bg-error text-on-error animate-pulse"
          : "text-primary-container hover:bg-surface-container-high",
      ].join(" ")}
    >
      <Icon name="mic" size={24} filled={active} />
    </button>
  );
}
