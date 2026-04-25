import { query } from '@/lib/db';
import type {
  CheckInQuestionnaire,
  CheckInQuestion,
  BelongingScore,
  SupportRecommendation,
} from '@/types/checkin';
import type { PersonalizationProfile } from '@/types/student';

// ── Row types ──

interface QuestionnaireRow {
  id: string;
  student_id: string;
  week_of: Date;
}

// ── Default questions ──

const DEFAULT_QUESTIONS: CheckInQuestion[] = [
  { id: 'q1', text: 'I feel like I belong at this school.', responseType: 'scale_1_5' },
  { id: 'q2', text: 'I have people I can turn to for help.', responseType: 'scale_1_5' },
  { id: 'q3', text: 'I feel confident about my academic progress.', responseType: 'scale_1_5' },
  { id: 'q4', text: 'I feel connected to other students.', responseType: 'scale_1_5' },
  { id: 'q5', text: 'I know where to find the resources I need.', responseType: 'scale_1_5' },
];

const BELONGING_THRESHOLD = 40;

/**
 * Get or create this week's check-in questionnaire for a student.
 */
export async function getWeeklyCheckIn(studentId: string): Promise<CheckInQuestionnaire> {
  // Check if a questionnaire already exists for this week
  const existing = await query<QuestionnaireRow>(
    `SELECT * FROM check_in_questionnaires
     WHERE student_id = $1 AND week_of >= date_trunc('week', NOW())
     LIMIT 1`,
    [studentId],
  );

  if (existing.length > 0) {
    return {
      id: existing[0].id,
      studentId: existing[0].student_id,
      weekOf: existing[0].week_of,
      questions: DEFAULT_QUESTIONS,
    };
  }

  // Create a new questionnaire for this week
  const rows = await query<QuestionnaireRow>(
    `INSERT INTO check_in_questionnaires (student_id, week_of)
     VALUES ($1, date_trunc('week', NOW()))
     RETURNING *`,
    [studentId],
  );

  return {
    id: rows[0].id,
    studentId: rows[0].student_id,
    weekOf: rows[0].week_of,
    questions: DEFAULT_QUESTIONS,
  };
}


/**
 * Submit check-in responses and compute belonging score.
 */
export async function submitCheckIn(
  studentId: string,
  responses: Record<string, number | boolean | string>,
): Promise<BelongingScore> {
  const score = computeBelongingScore(responses);

  // Store the belonging score
  await query(
    `INSERT INTO belonging_scores (student_id, value, below_threshold, computed_at)
     VALUES ($1, $2, $3, NOW())`,
    [studentId, score.value, score.belowThreshold],
  );

  // Update student profile with latest score
  await query(
    `UPDATE student_profiles SET belonging_score = $1, last_check_in = NOW()
     WHERE user_id = $2`,
    [score.value, studentId],
  );

  return score;
}

/**
 * Pure function: compute belonging score from check-in responses.
 * Averages all scale responses (1-5), normalizes to 0-100.
 * Threshold at 40 — below this triggers support recommendations.
 */
export function computeBelongingScore(
  responses: Record<string, number | boolean | string>,
): BelongingScore {
  const scaleValues: number[] = [];

  for (const value of Object.values(responses)) {
    if (typeof value === 'number' && value >= 1 && value <= 5) {
      scaleValues.push(value);
    }
  }

  // Normalize: average of 1-5 scale → 0-100
  const avg = scaleValues.length > 0
    ? scaleValues.reduce((sum, v) => sum + v, 0) / scaleValues.length
    : 3; // default to neutral if no scale responses

  const normalized = ((avg - 1) / 4) * 100; // 1→0, 5→100

  return {
    value: Math.round(normalized),
    belowThreshold: normalized < BELONGING_THRESHOLD,
    computedAt: new Date(),
  };
}

/**
 * Get support recommendations when belonging score is below threshold.
 */
export function getSupportRecommendations(
  score: BelongingScore,
  _profile: PersonalizationProfile,
): SupportRecommendation[] {
  if (!score.belowThreshold) return [];

  const recommendations: SupportRecommendation[] = [
    {
      type: 'mentor_session',
      title: 'Talk to your mentor',
      description: 'Schedule a check-in with your mentor. They understand what you are going through.',
      actionUrl: '/mentors',
    },
    {
      type: 'community_channel',
      title: 'Join a community channel',
      description: 'Connect with other students who share your experiences.',
      actionUrl: '/community',
    },
  ];

  if (score.value < 20) {
    recommendations.push({
      type: 'resource',
      title: 'Campus support resources',
      description: 'Your campus has people ready to help. Check out these resources.',
      actionUrl: '/resources',
    });
  }

  return recommendations;
}
