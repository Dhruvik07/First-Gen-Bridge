import type { MentorProfile, CompatibilityScore } from "@/types";
import TagChip from "@/components/common/TagChip";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";

export interface MentorCardProps {
  mentor: MentorProfile;
  score?: CompatibilityScore;
  rank?: number;
  isTopMatch?: boolean;
}

function getInitials(narrative: string): string {
  const words = narrative.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0]?.[0]?.toUpperCase() ?? "M";
}

const challengeLabels: Record<string, string> = {
  financial_hardship: "Financial Hardship",
  cultural_adjustment: "Cultural Adjustment",
  academic_preparedness: "Academic Prep",
  family_expectations: "Family Expectations",
  language_barrier: "Language Barrier",
  imposter_syndrome: "Imposter Syndrome",
};

export default function MentorCard({
  mentor,
  score,
  rank,
  isTopMatch,
}: MentorCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
      {isTopMatch && (
        <span className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container font-semibold text-label-bold px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
          <Icon name="star" size={16} filled />
          Top Match
        </span>
      )}

      <div className="flex items-center gap-3 mb-4">
        {/* Avatar placeholder with initials */}
        <div className="w-16 h-16 rounded-full border-2 border-primary-container p-[2px] flex items-center justify-center bg-primary-fixed text-on-primary-fixed text-headline-md shrink-0">
          {getInitials(mentor.firstGenNarrative)}
        </div>
        <div className="min-w-0">
          <h3 className="text-headline-md text-on-surface truncate">
            Mentor{rank ? ` #${rank}` : ""}
          </h3>
          <p className="text-body-md text-on-surface-variant truncate">
            {mentor.educationalBackground}
          </p>
        </div>
      </div>

      {/* Challenge tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {mentor.challengesOvercome.map((challenge) => (
          <TagChip
            key={challenge}
            label={challengeLabels[challenge] ?? challenge}
            variant="primary"
          />
        ))}
      </div>

      {/* Languages */}
      {mentor.languagesSpoken.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {mentor.languagesSpoken.map((lang) => (
            <TagChip key={lang} label={lang} variant="secondary" icon="translate" />
          ))}
        </div>
      )}

      {/* Narrative excerpt */}
      <p className="text-body-md text-on-surface-variant line-clamp-3 mb-6 flex-1">
        {mentor.firstGenNarrative}
      </p>

      {/* Score breakdown */}
      {score && (
        <p className="text-label-sm text-on-surface-variant mb-4">
          Match: {score.total}%
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button variant="primary" size="sm" icon="person_add">
          Connect
        </Button>
        <Button variant="outline" size="sm" icon="visibility">
          View Profile
        </Button>
      </div>
    </div>
  );
}
