import Icon from "@/components/common/Icon";

export interface ChatBubbleProps {
  role: "student" | "guide";
  content: string;
  timestamp?: Date;
  avatar?: string;
}

export default function ChatBubble({
  role,
  content,
  timestamp,
}: ChatBubbleProps) {
  const isGuide = role === "guide";

  return (
    <div className="max-w-3xl mx-auto">
      <div
        className={[
          "flex gap-3",
          isGuide ? "flex-row" : "flex-row-reverse",
        ].join(" ")}
      >
        {/* Avatar */}
        {isGuide ? (
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <Icon name="psychology" size={20} filled />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
            <Icon name="person" size={20} filled />
          </div>
        )}

        <div className={isGuide ? "" : "flex flex-col items-end"}>
          {/* Label */}
          <p className="text-label-bold text-on-surface-variant mb-1">
            {isGuide ? "AI Coach" : "You"}
          </p>

          {/* Bubble */}
          <div
            className={[
              "p-5 text-body-md shadow-sm max-w-prose",
              isGuide
                ? "bg-surface border border-[#E0E0E0] rounded-xl rounded-tl-none text-on-background"
                : "bg-primary-container text-on-primary rounded-xl rounded-tr-none",
            ].join(" ")}
          >
            {content}
          </div>

          {/* Timestamp */}
          {timestamp && (
            <p className="text-label-sm text-on-surface-variant mt-1">
              {timestamp instanceof Date
                ? timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date(timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
