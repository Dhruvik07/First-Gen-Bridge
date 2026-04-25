import { query } from '@/lib/db';
import type { ResourceCard, ResourceTag, ResourceReview, GapReport } from '@/types/resource';
import type { PersonalizationProfile } from '@/types/student';

// ── Row types for SQL results ──

interface ResourceRow {
  id: string;
  institution_id: string;
  title: string;
  plain_language_description: string;
  intended_audience: string;
  access_steps: string[];
  what_to_expect: string;
  available_languages: string[];
  tags: string[];
  created_at: Date;
}

interface ReviewRow {
  id: string;
  resource_id: string;
  student_id: string;
  content: string;
  approved: boolean;
  created_at: Date;
}

// ── Helpers ──

function toResourceCard(row: ResourceRow, reviews: ResourceReview[]): ResourceCard {
  return {
    id: row.id,
    institutionId: row.institution_id,
    title: row.title,
    plainLanguageDescription: row.plain_language_description,
    intendedAudience: row.intended_audience,
    accessSteps: row.access_steps,
    whatToExpect: row.what_to_expect,
    reviews,
    availableLanguages: row.available_languages,
    tags: row.tags as ResourceTag[],
  };
}

function toReview(row: ReviewRow): ResourceReview {
  return {
    id: row.id,
    studentId: row.student_id,
    content: row.content,
    approved: row.approved,
    createdAt: row.created_at,
  };
}

/**
 * Determine which tags to boost based on the student's personalization profile.
 */
function getBoostTags(profile: PersonalizationProfile): ResourceTag[] {
  const boost: ResourceTag[] = [];
  if (profile.internationalStudent) boost.push('visa_relevant');
  if (profile.parentingStatus) {
    boost.push('childcare');
    boost.push('flexible_scheduling');
  }
  if (profile.workSchedule === 'full_time') {
    boost.push('asynchronous');
    boost.push('evening_accessible');
  }
  if (profile.disabilityStatus) {
    boost.push('accommodation_pathway');
    boost.push('disability_specific');
  }
  return boost;
}

// ── Service functions ──

/**
 * Search resources by plain-language query with personalization boosting.
 * Uses SQL ILIKE on title + description for now (Bedrock KB integration in task 15.6).
 */
export async function searchResources(
  queryText: string,
  profile: PersonalizationProfile,
  institutionId: string,
): Promise<ResourceCard[]> {
  const pattern = `%${queryText}%`;

  const rows = await query<ResourceRow>(
    `SELECT * FROM resources
     WHERE institution_id = $1
       AND (title ILIKE $2 OR plain_language_description ILIKE $2)
     ORDER BY created_at DESC`,
    [institutionId, pattern],
  );

  // Fetch approved reviews for all matched resources
  const resourceIds = rows.map((r) => r.id);
  const reviewsByResource = await fetchReviewsForResources(resourceIds);

  // Build cards
  let cards = rows.map((row) =>
    toResourceCard(row, reviewsByResource.get(row.id) ?? []),
  );

  // Apply personalization boosting — resources with matching tags sort first
  const boostTags = getBoostTags(profile);
  if (boostTags.length > 0) {
    cards = cards.sort((a, b) => {
      const aScore = a.tags.filter((t) => boostTags.includes(t)).length;
      const bScore = b.tags.filter((t) => boostTags.includes(t)).length;
      return bScore - aScore; // higher boost score first
    });
  }

  return cards;
}

/**
 * Get a single resource card with its approved reviews.
 */
export async function getResourceCard(resourceId: string): Promise<ResourceCard | null> {
  const rows = await query<ResourceRow>(
    `SELECT * FROM resources WHERE id = $1`,
    [resourceId],
  );

  if (rows.length === 0) return null;

  const reviewRows = await query<ReviewRow>(
    `SELECT * FROM resource_reviews WHERE resource_id = $1 ORDER BY created_at DESC`,
    [resourceId],
  );

  return toResourceCard(rows[0], reviewRows.map(toReview));
}

/**
 * Submit a review for a resource. Reviews start unapproved (moderation gate).
 */
export async function submitReview(
  resourceId: string,
  review: { studentId: string; content: string },
): Promise<ResourceReview> {
  const rows = await query<ReviewRow>(
    `INSERT INTO resource_reviews (resource_id, student_id, content, approved)
     VALUES ($1, $2, $3, false)
     RETURNING *`,
    [resourceId, review.studentId, review.content],
  );

  return toReview(rows[0]);
}

/**
 * Submit a gap report for a missing resource.
 */
export async function submitGapReport(
  studentId: string,
  report: { institutionId: string; category: string; description: string },
): Promise<GapReport> {
  const rows = await query<{
    id: string;
    student_id: string;
    institution_id: string;
    category: string;
    description: string;
    created_at: Date;
  }>(
    `INSERT INTO gap_reports (student_id, institution_id, category, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [studentId, report.institutionId, report.category, report.description],
  );

  const row = rows[0];
  return {
    id: row.id,
    studentId: row.student_id,
    institutionId: row.institution_id,
    category: row.category,
    description: row.description,
    createdAt: row.created_at,
  };
}

// ── Internal helpers ──

async function fetchReviewsForResources(
  resourceIds: string[],
): Promise<Map<string, ResourceReview[]>> {
  const map = new Map<string, ResourceReview[]>();
  if (resourceIds.length === 0) return map;

  const placeholders = resourceIds.map((_, i) => `$${i + 1}`).join(', ');
  const rows = await query<ReviewRow>(
    `SELECT * FROM resource_reviews
     WHERE resource_id IN (${placeholders}) AND approved = true
     ORDER BY created_at DESC`,
    resourceIds,
  );

  for (const row of rows) {
    const reviews = map.get(row.resource_id) ?? [];
    reviews.push(toReview(row));
    map.set(row.resource_id, reviews);
  }

  return map;
}
