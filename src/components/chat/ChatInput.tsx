"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import Icon from "@/components/common/Icon";

export interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  placeholder = "Type your message...",
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }

  return (
    <div className="border-t border-[#E0E0E0] bg-surface-container-lowest p-4 md:p-6 sticky bottom-0">
      <div className="max-w-3xl mx-auto relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full bg-white border border-[#E0E0E0] rounded-lg pl-4 pr-16 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none min-h-[56px] shadow-sm"
          aria-label="Message input"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="absolute right-2 top-2 bottom-2 bg-primary-container text-on-primary w-10 rounded-md flex items-center justify-center hover:bg-primary transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Icon name="send" size={20} filled />
        </button>
      </div>
      <p className="max-w-3xl mx-auto text-label-sm text-on-surface-variant mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
