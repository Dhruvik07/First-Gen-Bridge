import { query } from '@/lib/db';
import type { GapReport, GapAggregate } from '@/types/resource';

// ── Row types ──

interface GapReportRow {
  id: string;
  student_id: string;
  institution_id: string;
  category: string;
  description: string;
  created_at: Date;
}

interface SystemicGapRow {
  id: string;
  mentor_id: string;
  institution_id: string;
  description: string;
  created_at: Date;
}

interface AggregateRow {
  category: string;
  institution_id: string;
  count: string; // COUNT returns string in pg
}

// ── Helpers ──

function toGapReport(row: GapReportRow): GapReport {
  return {
    id: row.id,
    studentId: row.student_id,
    institutionId: row.institution_id,
    category: row.category,
    description: row.description,
    createdAt: row.created_at,
  };
}

// ── Service functions ──

/**
 * Submit a gap report from a student.
 */
export async function submitGapReport(
  studentId: string,
  institutionId: string,
  category: string,
  description: string,
): Promise<GapReport> {
  const rows = await query<GapReportRow>(
    `INSERT INTO gap_reports (student_id, institution_id, category, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [studentId, institutionId, category, description],
  );

  return toGapReport(rows[0]);
}

/**
 * Aggregate gap reports by category for an institution.
 * surfacedToInstitution is true when count > 5.
 */
export async function getGapAggregates(institutionId: string): Promise<GapAggregate[]> {
  // Get aggregated counts
  const aggregateRows = await query<AggregateRow>(
    `SELECT category, institution_id, COUNT(*) as count
     FROM gap_reports
     WHERE institution_id = $1
     GROUP BY category, institution_id
     ORDER BY count DESC`,
    [institutionId],
  );

  // Fetch individual reports per category
  const aggregates: GapAggregate[] = [];
  for (const agg of aggregateRows) {
    const count = parseInt(agg.count, 10);
    const reportRows = await query<GapReportRow>(
      `SELECT * FROM gap_reports
       WHERE institution_id = $1 AND category = $2
       ORDER BY created_at DESC`,
      [institutionId, agg.category],
    );

    aggregates.push({
      category: agg.category,
      institutionId: agg.institution_id,
      count,
      reports: reportRows.map(toGapReport),
      surfacedToInstitution: count > 5,
    });
  }

  return aggregates;
}

/**
 * Get institution dashboard data: student gap aggregates + systemic gap reports.
 */
export async function getInstitutionDashboard(institutionId: string): Promise<{
  gapAggregates: GapAggregate[];
  systemicReports: Array<{
    id: string;
    mentorId: string;
    institutionId: string;
    description: string;
    createdAt: Date;
  }>;
}> {
  const gapAggregates = await getGapAggregates(institutionId);

  const systemicRows = await query<SystemicGapRow>(
    `SELECT * FROM systemic_gap_reports
     WHERE institution_id = $1
     ORDER BY created_at DESC`,
    [institutionId],
  );

  const systemicReports = systemicRows.map((row) => ({
    id: row.id,
    mentorId: row.mentor_id,
    institutionId: row.institution_id,
    description: row.description,
    createdAt: row.created_at,
  }));

  return { gapAggregates, systemicReports };
}


/**
 * Search for students or mentors who navigated a similar resource gap.
 * If found, return peer info for Community Space introduction.
 * If not found, return null (gap is recorded for institution review).
 */
export async function findPeerForGap(
  studentId: string,
  category: string,
): Promise<{ peerId: string; peerType: 'student' | 'mentor'; category: string } | null> {
  // First check mentors who have overcome challenges in this category
  const mentorRows = await query<{ user_id: string }>(
    `SELECT mp.user_id FROM mentor_profiles mp
     WHERE mp.verified = true
       AND mp.user_id != $1
       AND $2 = ANY(mp.challenges_overcome)
     LIMIT 1`,
    [studentId, category],
  );

  if (mentorRows.length > 0) {
    return {
      peerId: mentorRows[0].user_id,
      peerType: 'mentor',
      category,
    };
  }

  // Then check students who previously submitted gap reports in the same category
  // and have since been active (indicating they found a solution)
  const studentRows = await query<{ student_id: string }>(
    `SELECT DISTINCT gr.student_id FROM gap_reports gr
     JOIN student_profiles sp ON sp.user_id = gr.student_id
     WHERE gr.category = $1
       AND gr.student_id != $2
       AND sp.onboarding_complete = true
     LIMIT 1`,
    [category, studentId],
  );

  if (studentRows.length > 0) {
    return {
      peerId: studentRows[0].student_id,
      peerType: 'student',
      category,
    };
  }

  return null;
}
