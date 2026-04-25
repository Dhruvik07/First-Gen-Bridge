import type { ArchiveEntry } from "@/types";
import Icon from "@/components/common/Icon";

export interface WinCardProps {
  entry: ArchiveEntry;
  studentName?: string;
}

const typeIcons: Record<ArchiveEntry["type"], string> = {
  communication_draft: "send",
  mentor_session: "groups",
  community_contribution: "forum",
  custom: "star",
};

const typeLabels: Record<ArchiveEntry["type"], string> = {
  communication_draft: "Communication Win",
  mentor_session: "Mentor Session",
  community_contribution: "Community Contribution",
  custom: "Personal Win",
};

export default function WinCard({ entry, studentName }: WinCardProps) {
  const icon = typeIcons[entry.type];
  const label = typeLabels[entry.type];
  const displayName = studentName ?? "Anonymous";
  const dateStr = entry.createdAt instanceof Date
    ? entry.createdAt.toLocaleDateString()
    : new Date(entry.createdAt).toLocaleDateString();

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
          <Icon name={icon} size={20} filled />
        </div>
        <div className="min-w-0">
          <p className="text-label-bold text-on-surface">{label}</p>
          <p className="text-label-sm text-on-surface-variant">{dateStr}</p>
        </div>
      </div>

      <p className="text-body-md text-on-surface flex-1 mb-3">
        {entry.description}
      </p>

      <p className="text-label-sm text-on-surface-variant mt-auto">
        <Icon name="person" size={14} className="inline-block align-text-bottom mr-1" />
        {displayName}
      </p>
    </div>
  );
}
