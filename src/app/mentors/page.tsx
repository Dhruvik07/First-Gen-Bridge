import type { MentorProfile, CompatibilityScore, RankedMatch } from "@/types";
import MentorCard from "@/components/cards/MentorCard";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";

/*
 * TODO (Task 13.5): Replace mock data below with live API calls:
 *   - GET /api/mentors?institutionId=... → listAvailableMentors
 *   - POST /api/mentors/match → getTopMatches(studentProfile, institutionId)
 * Wire search/filter bar to query params and re-fetch.
 */

/* ── Mock mentor data with realistic first-gen narratives ── */
const mockMentors: MentorProfile[] = [
  {
    userId: "mentor-1",
    verified: true,
    firstGenNarrative:
      "I grew up in a small farming town where nobody in my family had been to college. When I got my acceptance letter, my parents were proud but had no idea how to help me navigate financial aid or pick classes. I figured it out one step at a time, and now I want to help others do the same.",
    challengesOvercome: ["financial_hardship", "academic_preparedness", "imposter_syndrome"],
    topicsAvailable: ["Financial Aid", "Study Skills", "Time Management", "Choosing a Major"],
    languagesSpoken: ["English", "Spanish"],
    educationalBackground: "B.S. Biology, Minor in Chemistry",
    expectedResponseTime: "24 hours",
    institutionId: "inst-1",
    averageRating: 4.8,
    trainingCompleted: true,
  },
  {
    userId: "mentor-2",
    verified: true,
    firstGenNarrative:
      "Moving to the U.S. from Guatemala at 16 and starting college two years later was overwhelming. I didn't know what office hours were or how to email a professor. Those 'unspoken rules' tripped me up constantly, but each mistake taught me something valuable I can now share.",
    challengesOvercome: ["cultural_adjustment", "language_barrier", "family_expectations"],
    topicsAvailable: ["Campus Culture", "Professor Communication", "Cultural Adjustment", "ESL Resources"],
    languagesSpoken: ["English", "Spanish", "K'iche'"],
    educationalBackground: "B.A. Sociology, M.S.W. candidate",
    expectedResponseTime: "48 hours",
    institutionId: "inst-1",
    averageRating: 4.9,
    trainingCompleted: true,
  },
  {
    userId: "mentor-3",
    verified: true,
    firstGenNarrative:
      "I'm a single mom who went back to school at 28. Balancing a toddler, a part-time job, and a full course load felt impossible some days. I learned how to find childcare grants, negotiate deadlines, and ask for help — things I wish someone had told me sooner.",
    challengesOvercome: ["financial_hardship", "family_expectations", "academic_preparedness"],
    topicsAvailable: ["Parenting in College", "Flexible Scheduling", "Financial Resources", "Self-Advocacy"],
    languagesSpoken: ["English"],
    educationalBackground: "B.A. Early Childhood Education",
    expectedResponseTime: "24 hours",
    institutionId: "inst-1",
    averageRating: 4.7,
    trainingCompleted: true,
  },
  {
    userId: "mentor-4",
    verified: true,
    firstGenNarrative:
      "As a first-gen student from a refugee family, I carried the weight of my parents' sacrifices every day. Imposter syndrome hit hard in my engineering classes. Joining a study group and finding a mentor changed everything — I want to be that person for someone else.",
    challengesOvercome: ["cultural_adjustment", "imposter_syndrome", "language_barrier"],
    topicsAvailable: ["Engineering", "Study Groups", "Mental Health Resources", "Scholarship Applications"],
    languagesSpoken: ["English", "Arabic", "French"],
    educationalBackground: "B.S. Mechanical Engineering",
    expectedResponseTime: "72 hours",
    institutionId: "inst-1",
    averageRating: 4.6,
    trainingCompleted: true,
  },
];

const mockScores: Record<string, CompatibilityScore> = {
  "mentor-1": {
    total: 92,
    breakdown: {
      majorAlignment: 18,
      sharedChallenges: 25,
      culturalBackground: 20,
      languagePreference: 12,
      institutionFamiliarity: 9,
      personalizationOverlap: 8,
    },
  },
  "mentor-2": {
    total: 85,
    breakdown: {
      majorAlignment: 10,
      sharedChallenges: 22,
      culturalBackground: 24,
      languagePreference: 14,
      institutionFamiliarity: 8,
      personalizationOverlap: 7,
    },
  },
  "mentor-3": {
    total: 78,
    breakdown: {
      majorAlignment: 12,
      sharedChallenges: 20,
      culturalBackground: 15,
      languagePreference: 10,
      institutionFamiliarity: 11,
      personalizationOverlap: 10,
    },
  },
  "mentor-4": {
    total: 71,
    breakdown: {
      majorAlignment: 14,
      sharedChallenges: 18,
      culturalBackground: 16,
      languagePreference: 8,
      institutionFamiliarity: 7,
      personalizationOverlap: 8,
    },
  },
};

const mockMatches: RankedMatch[] = mockMentors
  .map((mentor, i) => ({
    mentor,
    score: mockScores[mentor.userId],
    rank: i + 1,
  }))
  .sort((a, b) => b.score.total - a.score.total);

/* ── Score breakdown bar ── */
function ScoreBreakdown({ score }: { score: CompatibilityScore }) {
  const factors = [
    { label: "Shared Challenges", value: score.breakdown.sharedChallenges, max: 25 },
    { label: "Cultural Background", value: score.breakdown.culturalBackground, max: 25 },
    { label: "Major Alignment", value: score.breakdown.majorAlignment, max: 20 },
    { label: "Language", value: score.breakdown.languagePreference, max: 15 },
    { label: "Institution", value: score.breakdown.institutionFamiliarity, max: 10 },
    { label: "Personalization", value: score.breakdown.personalizationOverlap, max: 10 },
  ];

  return (
    <div className="space-y-1.5">
      <p className="text-label-bold text-on-surface">
        Match Score: {score.total}%
      </p>
      {factors.map((f) => (
        <div key={f.label} className="flex items-center gap-2">
          <span className="text-label-sm text-on-surface-variant w-32 shrink-0 truncate">
            {f.label}
          </span>
          <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full transition-all"
              style={{ width: `${(f.value / f.max) * 100}%` }}
            />
          </div>
          <span className="text-label-sm text-on-surface-variant w-6 text-right">
            {f.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-xl text-center">
      <Icon name="group_off" size={64} className="text-on-surface-variant mb-4" />
      <h2 className="text-headline-md text-on-surface mb-2">
        No mentor matches yet
      </h2>
      <p className="text-body-lg text-on-surface-variant max-w-md mb-6">
        We could not find mentors matching your profile right now. Check out the Community Space to connect with peers who share your experiences.
      </p>
      <Button variant="primary" size="lg" icon="groups">
        Explore Community
      </Button>
    </div>
  );
}

/* ── Page component ── */
export default function MentorsPage() {
  const matches = mockMatches;
  const hasMatches = matches.length > 0;

  return (
    <div className="flex-1 overflow-y-auto p-md md:p-lg pb-24 md:pb-lg bg-surface">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-headline-xl text-on-surface mb-xs">
          Your Mentor Matches
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          Mentors who share your background and understand your challenges.
          Each match is ranked by how closely their experience aligns with yours.
        </p>

        {/* Search / filter bar */}
        <div className="mt-md flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon
              name="search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="search"
              placeholder="Search by major, language, or challenge…"
              aria-label="Search mentors"
              className="w-full rounded-full border border-outline-variant bg-surface-container-lowest pl-10 pr-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-bold text-on-surface hover:bg-surface-container-high transition-colors min-h-[44px]"
            >
              <Icon name="translate" size={18} />
              Language
              <Icon name="arrow_drop_down" size={18} />
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-bold text-on-surface hover:bg-surface-container-high transition-colors min-h-[44px]"
            >
              <Icon name="filter_list" size={18} />
              Challenges
              <Icon name="arrow_drop_down" size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        {hasMatches ? (
          <div className="mt-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {matches.map((match, index) => (
              <div key={match.mentor.userId} className="flex flex-col gap-3">
                <MentorCard
                  mentor={match.mentor}
                  score={match.score}
                  rank={match.rank}
                  isTopMatch={index === 0}
                />
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-sm">
                  <ScoreBreakdown score={match.score} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
