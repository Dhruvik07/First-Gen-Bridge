import type { MentorProfile } from "@/types";
import TagChip from "@/components/common/TagChip";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import Link from "next/link";

/*
 * TODO (Task 13.5): Replace mock data below with live API calls:
 *   - GET /api/mentors/[id] → getMentorProfile
 *   - POST /api/mentors/[id]/connect → create mentorship_connection (pending)
 *   - POST /api/mentors/[id]/flag → flagInteraction
 *   - GET /api/mentors/messages?connectionId=... → fetch messages
 *   - POST /api/mentors/sessions → schedule video check-in
 *   - GET /api/mentors/sessions/group?mentorId=... → list group sessions
 */

/* ── Mock mentor data (same source, keyed by userId) ── */
const mentorData: Record<string, MentorProfile> = {
  "mentor-1": {
    userId: "mentor-1",
    verified: true,
    firstGenNarrative:
      "I grew up in a small farming town where nobody in my family had been to college. When I got my acceptance letter, my parents were proud but had no idea how to help me navigate financial aid or pick classes. I figured it out one step at a time, and now I want to help others do the same. The hardest part was feeling like I didn't belong — everyone else seemed to know the rules already. But once I found my people and learned to ask for help, everything changed.",
    challengesOvercome: ["financial_hardship", "academic_preparedness", "imposter_syndrome"],
    topicsAvailable: ["Financial Aid", "Study Skills", "Time Management", "Choosing a Major"],
    languagesSpoken: ["English", "Spanish"],
    educationalBackground: "B.S. Biology, Minor in Chemistry",
    expectedResponseTime: "24 hours",
    institutionId: "inst-1",
    averageRating: 4.8,
    trainingCompleted: true,
  },
  "mentor-2": {
    userId: "mentor-2",
    verified: true,
    firstGenNarrative:
      "Moving to the U.S. from Guatemala at 16 and starting college two years later was overwhelming. I didn't know what office hours were or how to email a professor. Those 'unspoken rules' tripped me up constantly, but each mistake taught me something valuable I can now share. I want every student who feels lost to know that it's okay to not know — and that someone is here to walk with you.",
    challengesOvercome: ["cultural_adjustment", "language_barrier", "family_expectations"],
    topicsAvailable: ["Campus Culture", "Professor Communication", "Cultural Adjustment", "ESL Resources"],
    languagesSpoken: ["English", "Spanish", "K'iche'"],
    educationalBackground: "B.A. Sociology, M.S.W. candidate",
    expectedResponseTime: "48 hours",
    institutionId: "inst-1",
    averageRating: 4.9,
    trainingCompleted: true,
  },
  "mentor-3": {
    userId: "mentor-3",
    verified: true,
    firstGenNarrative:
      "I'm a single mom who went back to school at 28. Balancing a toddler, a part-time job, and a full course load felt impossible some days. I learned how to find childcare grants, negotiate deadlines, and ask for help — things I wish someone had told me sooner. If you're juggling life and school, I've been there, and I'd love to help you find your path.",
    challengesOvercome: ["financial_hardship", "family_expectations", "academic_preparedness"],
    topicsAvailable: ["Parenting in College", "Flexible Scheduling", "Financial Resources", "Self-Advocacy"],
    languagesSpoken: ["English"],
    educationalBackground: "B.A. Early Childhood Education",
    expectedResponseTime: "24 hours",
    institutionId: "inst-1",
    averageRating: 4.7,
    trainingCompleted: true,
  },
  "mentor-4": {
    userId: "mentor-4",
    verified: true,
    firstGenNarrative:
      "As a first-gen student from a refugee family, I carried the weight of my parents' sacrifices every day. Imposter syndrome hit hard in my engineering classes. Joining a study group and finding a mentor changed everything — I want to be that person for someone else. No question is too small, and no struggle is too minor to talk about.",
    challengesOvercome: ["cultural_adjustment", "imposter_syndrome", "language_barrier"],
    topicsAvailable: ["Engineering", "Study Groups", "Mental Health Resources", "Scholarship Applications"],
    languagesSpoken: ["English", "Arabic", "French"],
    educationalBackground: "B.S. Mechanical Engineering",
    expectedResponseTime: "72 hours",
    institutionId: "inst-1",
    averageRating: 4.6,
    trainingCompleted: true,
  },
};

const challengeLabels: Record<string, string> = {
  financial_hardship: "Financial Hardship",
  cultural_adjustment: "Cultural Adjustment",
  academic_preparedness: "Academic Preparedness",
  family_expectations: "Family Expectations",
  language_barrier: "Language Barrier",
  imposter_syndrome: "Imposter Syndrome",
};

/* ── Star rating display ── */
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name={i < fullStars ? "star" : i === fullStars && hasHalf ? "star_half" : "star"}
          size={20}
          filled={i < fullStars || (i === fullStars && hasHalf)}
          className={
            i < fullStars || (i === fullStars && hasHalf)
              ? "text-secondary-container"
              : "text-outline-variant"
          }
        />
      ))}
      <span className="text-label-bold text-on-surface ml-1">{rating}</span>
    </div>
  );
}

/* ── Not found state ── */
function MentorNotFound() {
  return (
    <div className="flex-1 overflow-y-auto p-md md:p-lg pb-24 md:pb-lg bg-surface">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-xl text-center">
        <Icon name="person_off" size={64} className="text-on-surface-variant mb-4" />
        <h1 className="text-headline-md text-on-surface mb-2">Mentor not found</h1>
        <p className="text-body-lg text-on-surface-variant mb-6">
          We could not find a mentor with that ID. They may have been removed or the link may be incorrect.
        </p>
        <Link href="/mentors">
          <Button variant="primary" icon="arrow_back">
            Back to Mentor Matches
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ── Page component (params is a Promise in Next.js 15+) ── */
export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mentor = mentorData[id];

  if (!mentor) {
    return <MentorNotFound />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-md md:p-lg pb-24 md:pb-lg bg-surface">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/mentors"
          className="inline-flex items-center gap-1 text-label-bold text-primary-container hover:underline mb-md"
        >
          <Icon name="arrow_back" size={18} />
          Back to Matches
        </Link>

        {/* Profile header */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg">
          <div className="flex flex-col sm:flex-row items-start gap-md">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-2 border-primary-container p-[2px] flex items-center justify-center bg-primary-fixed text-on-primary-fixed text-headline-lg shrink-0">
              {mentor.firstGenNarrative.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-headline-lg text-on-surface">
                  Mentor Profile
                </h1>
                {mentor.verified && (
                  <span className="inline-flex items-center gap-1 text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
                    <Icon name="verified" size={14} filled />
                    Verified Mentor
                  </span>
                )}
              </div>
              <p className="text-body-lg text-on-surface-variant">
                {mentor.educationalBackground}
              </p>
              <div className="mt-2">
                <StarRating rating={mentor.averageRating} />
              </div>
            </div>
          </div>

          {/* First-gen narrative */}
          <div className="mt-md">
            <h2 className="text-headline-md text-on-surface mb-2">
              My Story
            </h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              {mentor.firstGenNarrative}
            </p>
          </div>
        </div>

        {/* Details grid */}
        <div className="mt-md grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Challenges overcome */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h3 className="text-headline-md text-on-surface mb-3 flex items-center gap-2">
              <Icon name="emoji_events" size={24} />
              Challenges Overcome
            </h3>
            <div className="flex flex-wrap gap-2">
              {mentor.challengesOvercome.map((challenge) => (
                <TagChip
                  key={challenge}
                  label={challengeLabels[challenge] ?? challenge}
                  variant="primary"
                />
              ))}
            </div>
          </div>

          {/* Available topics */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h3 className="text-headline-md text-on-surface mb-3 flex items-center gap-2">
              <Icon name="topic" size={24} />
              Available Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {mentor.topicsAvailable.map((topic) => (
                <TagChip key={topic} label={topic} variant="secondary" />
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h3 className="text-headline-md text-on-surface mb-3 flex items-center gap-2">
              <Icon name="translate" size={24} />
              Languages Spoken
            </h3>
            <div className="flex flex-wrap gap-2">
              {mentor.languagesSpoken.map((lang) => (
                <TagChip key={lang} label={lang} variant="surface" icon="translate" />
              ))}
            </div>
          </div>

          {/* Response time & rating */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h3 className="text-headline-md text-on-surface mb-3 flex items-center gap-2">
              <Icon name="schedule" size={24} />
              Availability
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="timer" size={20} className="text-on-surface-variant" />
                <span className="text-body-md text-on-surface">
                  Expected response: <strong>{mentor.expectedResponseTime}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="star" size={20} filled className="text-secondary-container" />
                <span className="text-body-md text-on-surface">
                  Average rating: <strong>{mentor.averageRating}/5</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action: Request Match */}
        <div className="mt-md bg-primary-fixed border border-outline-variant rounded-xl p-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-headline-md text-on-primary-fixed mb-1">
              Ready to connect?
            </h3>
            <p className="text-body-md text-on-primary-fixed-variant">
              Send a match request and this mentor will be notified within 24 hours.
            </p>
          </div>
          <Button variant="primary" size="lg" icon="person_add">
            Request Match
          </Button>
        </div>

        {/* Messaging interface placeholder */}
        <div className="mt-md">
          <h2 className="text-headline-md text-on-surface mb-3">
            Communication Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Async messaging */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-center">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-3">
                <Icon name="chat" size={24} className="text-on-primary-fixed" />
              </div>
              <h4 className="text-label-bold text-on-surface mb-1">Async Messaging</h4>
              <p className="text-body-md text-on-surface-variant">
                Send messages anytime. Your mentor will reply within their stated response time.
              </p>
            </div>

            {/* Video scheduling */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-center">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center mx-auto mb-3">
                <Icon name="videocam" size={24} className="text-on-secondary-fixed" />
              </div>
              <h4 className="text-label-bold text-on-surface mb-1">Video Check-ins</h4>
              <p className="text-body-md text-on-surface-variant">
                Schedule face-to-face video sessions at a time that works for both of you.
              </p>
            </div>

            {/* Group sessions */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-center">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center mx-auto mb-3">
                <Icon name="groups" size={24} className="text-on-tertiary-fixed" />
              </div>
              <h4 className="text-label-bold text-on-surface mb-1">Group Sessions</h4>
              <p className="text-body-md text-on-surface-variant">
                Join group sessions with up to 5 students who share similar challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Flag interaction */}
        <div className="mt-md flex justify-end">
          <Button variant="outline" size="sm" icon="flag">
            Flag Interaction
          </Button>
        </div>
      </div>
    </div>
  );
}
