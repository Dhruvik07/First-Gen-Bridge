import { query, getClient } from '@/lib/db';
import type {
  MentorProfile,
  MentorRegistrationData,
  MentorCandidate,
  MentorVerificationResult,
  TrainingResults,
} from '@/types/mentor';
import type { Challenge } from '@/types/student';

interface MentorRow {
  user_id: string;
  verified: boolean;
  first_gen_narrative: string;
  challenges_overcome: string[];
  topics_available: string[];
  languages_spoken: string[];
  educational_background: string;
  expected_response_time: string;
  average_rating: number;
  training_completed: boolean;
}

interface UserRow {
  id: string;
  institution_id: string;
}

function toMentorProfile(row: MentorRow, institutionId: string): MentorProfile {
  return {
    userId: row.user_id,
    verified: row.verified,
    firstGenNarrative: row.first_gen_narrative,
    challengesOvercome: row.challenges_overcome as Challenge[],
    topicsAvailable: row.topics_available,
    languagesSpoken: row.languages_spoken,
    educationalBackground: row.educational_background,
    expectedResponseTime: row.expected_response_time,
    institutionId,
    averageRating: Number(row.average_rating),
    trainingCompleted: row.training_completed,
  };
}

export async function submitRegistration(
  userId: string,
  data: MentorRegistrationData,
): Promise<MentorCandidate> {
  const rows = await query<MentorRow>(
    `INSERT INTO mentor_profiles (user_id, first_gen_narrative, challenges_overcome, topics_available, languages_spoken, educational_background)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      data.personalNarrative,
      data.areasOfExperience,
      data.areasOfExperience,
      data.languagesSpoken,
      data.educationalBackground,
    ],
  );

  const row = rows[0];
  return {
    id: row.user_id,
    userId: row.user_id,
    registrationData: data,
    trainingCompleted: row.training_completed,
    verified: row.verified,
    submittedAt: new Date(),
  };
}

export async function completeTraining(
  candidateId: string,
  results: TrainingResults,
): Promise<MentorVerificationResult> {
  if (results.passed) {
    await query(
      `UPDATE mentor_profiles SET training_completed = true, verified = true WHERE user_id = $1`,
      [candidateId],
    );
    return { verified: true, mentorId: candidateId, message: 'Training passed. Mentor verified.' };
  }

  await query(
    `UPDATE mentor_profiles SET training_completed = false WHERE user_id = $1`,
    [candidateId],
  );
  return {
    verified: false,
    mentorId: candidateId,
    failedSections: results.failedSections,
    message: 'Training not passed. Please review failed sections and retake.',
  };
}

export async function getMentorProfile(mentorId: string): Promise<MentorProfile | null> {
  const rows = await query<MentorRow & { institution_id: string }>(
    `SELECT mp.*, u.institution_id
     FROM mentor_profiles mp
     JOIN users u ON u.id = mp.user_id
     WHERE mp.user_id = $1`,
    [mentorId],
  );

  if (rows.length === 0) return null;
  return toMentorProfile(rows[0], rows[0].institution_id);
}

export async function listAvailableMentors(institutionId: string): Promise<MentorProfile[]> {
  const rows = await query<MentorRow & { institution_id: string }>(
    `SELECT mp.*, u.institution_id
     FROM mentor_profiles mp
     JOIN users u ON u.id = mp.user_id
     WHERE mp.verified = true AND u.institution_id = $1`,
    [institutionId],
  );

  return rows.map((r) => toMentorProfile(r, r.institution_id));
}

export async function submitSystemicGapReport(
  mentorId: string,
  report: { description: string; institutionId: string },
): Promise<void> {
  await query(
    `INSERT INTO systemic_gap_reports (mentor_id, institution_id, description) VALUES ($1, $2, $3)`,
    [mentorId, report.institutionId, report.description],
  );
}

export async function flagInteraction(
  studentId: string,
  mentorId: string,
  reason: string,
): Promise<void> {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Update mentorship connection to paused
    await client.query(
      `UPDATE mentorship_connections SET status = 'paused'
       WHERE student_id = $1 AND mentor_id = $2 AND status = 'active'`,
      [studentId, mentorId],
    );

    // Record the flag (using gap_reports table as a general flag store)
    await client.query(
      `INSERT INTO gap_reports (student_id, institution_id, category, description)
       VALUES ($1, (SELECT institution_id FROM users WHERE id = $1), 'mentor_flag', $2)`,
      [studentId, reason],
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
