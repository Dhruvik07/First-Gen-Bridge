import { query } from '@/lib/db';
import type { OnboardingSession, OnboardingStepData, OnboardingResult } from '@/types/onboarding';

// ── Row types ──

interface OnboardingRow {
  id: string;
  user_id: string;
  current_step: number;
  total_steps: number;
  step_data: Record<string, unknown>;
  completed: boolean;
  last_saved_at: Date;
}

const TOTAL_STEPS = 9; // name, institution, major, language, international, parenting, work, disability, challenges

function toSession(row: OnboardingRow): OnboardingSession {
  const stepData = new Map<number, OnboardingStepData>();
  if (row.step_data && typeof row.step_data === 'object') {
    for (const [key, value] of Object.entries(row.step_data)) {
      const stepNum = parseInt(key, 10);
      if (!isNaN(stepNum)) {
        stepData.set(stepNum, value as OnboardingStepData);
      }
    }
  }

  return {
    id: row.id,
    userId: row.user_id,
    currentStep: row.current_step,
    totalSteps: row.total_steps,
    stepData,
    completed: row.completed,
    lastSavedAt: row.last_saved_at,
  };
}

/**
 * Start a new onboarding session for a user.
 */
export async function startOnboarding(userId: string): Promise<OnboardingSession> {
  // Check for existing incomplete session first
  const existing = await resumeOnboarding(userId);
  if (existing) return existing;

  const rows = await query<OnboardingRow>(
    `INSERT INTO onboarding_sessions (user_id, current_step, total_steps, step_data, completed)
     VALUES ($1, 1, $2, '{}'::jsonb, false)
     RETURNING *, NOW() as last_saved_at`,
    [userId, TOTAL_STEPS],
  );

  return toSession(rows[0]);
}

/**
 * Submit a step in the onboarding flow.
 * Updates step_data JSONB, advances current_step, auto-saves.
 */
export async function submitStep(
  sessionId: string,
  stepData: OnboardingStepData,
): Promise<OnboardingSession> {
  const rows = await query<OnboardingRow>(
    `UPDATE onboarding_sessions
     SET step_data = step_data || $1::jsonb,
         current_step = GREATEST(current_step, $2 + 1),
         last_saved_at = NOW()
     WHERE id = $3 AND completed = false
     RETURNING *, last_saved_at`,
    [
      JSON.stringify({ [stepData.stepNumber]: stepData }),
      stepData.stepNumber,
      sessionId,
    ],
  );

  if (rows.length === 0) {
    throw new Error('Onboarding session not found or already completed');
  }

  return toSession(rows[0]);
}


/**
 * Resume an incomplete onboarding session for a user.
 */
export async function resumeOnboarding(userId: string): Promise<OnboardingSession | null> {
  const rows = await query<OnboardingRow>(
    `SELECT *, last_saved_at FROM onboarding_sessions
     WHERE user_id = $1 AND completed = false
     ORDER BY last_saved_at DESC
     LIMIT 1`,
    [userId],
  );

  if (rows.length === 0) return null;
  return toSession(rows[0]);
}

/**
 * Complete onboarding and generate recommendations.
 * Returns mentor match, channel, and resource recommendations.
 */
export async function completeOnboarding(sessionId: string): Promise<OnboardingResult> {
  // Mark session as completed
  const rows = await query<OnboardingRow>(
    `UPDATE onboarding_sessions SET completed = true, last_saved_at = NOW()
     WHERE id = $1
     RETURNING *, last_saved_at`,
    [sessionId],
  );

  if (rows.length === 0) {
    throw new Error('Onboarding session not found');
  }

  // Mark student profile as onboarding complete
  await query(
    `UPDATE student_profiles SET onboarding_complete = true WHERE user_id = $1`,
    [rows[0].user_id],
  );

  // Generate recommendations (placeholder — real implementation would call
  // matching engine, community service, and resource service)
  return {
    recommendedMentors: [],
    recommendedChannels: [],
    personalizedResources: [],
  };
}
