import type { MentorProfile, CompatibilityScore, CompatibilityWeights, RankedMatch, MentorRating } from '@/types/mentor';
import type { StudentProfile } from '@/types/student';

/**
 * Default weights — shared challenges and cultural background weighted HIGHER
 * than major alignment. Total max ~100.
 */
const DEFAULT_WEIGHTS: CompatibilityWeights = {
  sharedChallenges: 25,
  culturalBackground: 25,
  majorAlignment: 20,
  languagePreference: 15,
  institutionFamiliarity: 10,
  personalizationOverlap: 5,
};

/**
 * Pure function: compute compatibility between a student and a mentor.
 * Returns a score object with total (0-100) and per-factor breakdown.
 */
export function computeCompatibility(
  student: StudentProfile,
  mentor: MentorProfile,
  weights: CompatibilityWeights = DEFAULT_WEIGHTS,
): CompatibilityScore {
  const pp = student.personalizationProfile;

  // Shared challenges: fraction of student challenges that mentor overcame
  const studentChallenges = pp.challenges;
  const mentorChallenges = mentor.challengesOvercome;
  const sharedCount = studentChallenges.filter((c) => mentorChallenges.includes(c)).length;
  const sharedChallenges =
    studentChallenges.length > 0
      ? (sharedCount / studentChallenges.length) * weights.sharedChallenges
      : 0;

  // Cultural background: overlap between student and mentor backgrounds
  const studentBg = pp.culturalBackground;
  // Mentor doesn't have culturalBackground directly — approximate via narrative keywords
  // For now, use a simple heuristic: if mentor overcame cultural_adjustment, partial credit
  const culturalBackground = mentorChallenges.includes('cultural_adjustment')
    ? weights.culturalBackground * 0.7
    : studentBg.length > 0
      ? 0
      : weights.culturalBackground * 0.3;

  // Major alignment: exact match = full, partial match = 60%, no match = 0
  const hasExactMajorMatch = mentor.topicsAvailable.some(
    (t) => t.toLowerCase() === student.major.toLowerCase(),
  );
  const hasPartialMajorMatch =
    mentor.topicsAvailable.length > 0 &&
    mentor.topicsAvailable.some(
      (t) =>
        student.major.toLowerCase().includes(t.toLowerCase()) ||
        t.toLowerCase().includes(student.major.toLowerCase()),
    );
  const majorAlignment = hasExactMajorMatch
    ? weights.majorAlignment
    : hasPartialMajorMatch
      ? weights.majorAlignment * 0.6
      : 0;

  // Language preference: match = full score
  const languagePreference = mentor.languagesSpoken
    .map((l) => l.toLowerCase())
    .includes(pp.languagePreference.toLowerCase())
    ? weights.languagePreference
    : 0;

  // Institution familiarity: same institution = full score
  const institutionFamiliarity =
    mentor.institutionId === student.userId // placeholder — in real usage compare institution IDs
      ? weights.institutionFamiliarity
      : weights.institutionFamiliarity * 0.5; // partial credit for being on platform

  // Personalization overlap: bonus for matching life circumstances
  let personalizationOverlap = 0;
  const overlapFactors = [
    pp.internationalStudent && mentorChallenges.includes('cultural_adjustment'),
    pp.languagePreference !== 'en' && mentor.languagesSpoken.length > 1,
  ].filter(Boolean).length;
  personalizationOverlap = (overlapFactors / 2) * weights.personalizationOverlap;

  const total = Math.round(
    sharedChallenges +
    culturalBackground +
    majorAlignment +
    languagePreference +
    institutionFamiliarity +
    personalizationOverlap,
  );

  return {
    total: Math.min(total, 100),
    breakdown: {
      sharedChallenges: Math.round(sharedChallenges),
      culturalBackground: Math.round(culturalBackground),
      majorAlignment: Math.round(majorAlignment),
      languagePreference: Math.round(languagePreference),
      institutionFamiliarity: Math.round(institutionFamiliarity),
      personalizationOverlap: Math.round(personalizationOverlap),
    },
  };
}

/**
 * Rank all mentors by compatibility with the student, descending.
 */
export function rankMentors(student: StudentProfile, mentors: MentorProfile[]): RankedMatch[] {
  const scored = mentors.map((mentor) => ({
    mentor,
    score: computeCompatibility(student, mentor),
  }));

  scored.sort((a, b) => b.score.total - a.score.total);

  return scored.map((s, i) => ({
    mentor: s.mentor,
    score: s.score,
    rank: i + 1,
  }));
}

/**
 * Return the top N matches.
 */
export function getTopMatches(
  student: StudentProfile,
  mentors: MentorProfile[],
  count: number = 3,
): RankedMatch[] {
  return rankMentors(student, mentors).slice(0, count);
}

/**
 * Incorporate a rating into a mentor's average.
 * Returns the new average rating. This is a pure computation —
 * the caller is responsible for persisting the update.
 */
export function incorporateFeedback(
  currentAverage: number,
  currentCount: number,
  rating: MentorRating,
): number {
  const newTotal = currentAverage * currentCount + rating.score;
  return newTotal / (currentCount + 1);
}
