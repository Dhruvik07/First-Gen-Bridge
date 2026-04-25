import { query } from '@/lib/db';
import { moderateContent } from '@/services/ai-router';
import type { FlaggedContent, ModerationAction } from '@/types/community';

// ── Row types ──

interface FlaggedContentRow {
  id: string;
  post_id: string;
  reason: string;
  ai_confidence: number;
  reviewed_by: string | null;
  action: string | null;
  flagged_at: Date;
  reviewed_at: Date | null;
}

interface UserRow {
  id: string;
  role: string;
}

// ── Helpers ──

function toFlaggedContent(row: FlaggedContentRow): FlaggedContent {
  return {
    id: row.id,
    postId: row.post_id,
    reason: row.reason,
    aiConfidence: row.ai_confidence,
    reviewedBy: row.reviewed_by,
    action: row.action as ModerationAction | null,
    flaggedAt: row.flagged_at,
    reviewedAt: row.reviewed_at,
  };
}

// ── Service functions ──

/**
 * Flag content using the AI Router's moderation capability.
 * If flagged, inserts into flagged_content and hides the post.
 */
export async function flagContent(
  postId: string,
  content: string,
): Promise<{ flagged: boolean; reason: string | null }> {
  const result = await moderateContent(content);

  if (result.flagged) {
    // Insert into flagged_content table
    await query(
      `INSERT INTO flagged_content (post_id, reason, ai_confidence)
       VALUES ($1, $2, $3)
       ON CONFLICT (post_id) DO NOTHING`,
      [postId, result.reason, result.confidence],
    );

    // Hide the post from public view
    await query(
      `UPDATE posts SET moderation_status = 'flagged' WHERE id = $1`,
      [postId],
    );
  }

  return { flagged: result.flagged, reason: result.reason };
}

/**
 * Get the queue of flagged content awaiting moderator review.
 */
export async function getFlaggedQueue(): Promise<FlaggedContent[]> {
  const rows = await query<FlaggedContentRow>(
    `SELECT * FROM flagged_content WHERE action IS NULL ORDER BY flagged_at DESC`,
  );
  return rows.map(toFlaggedContent);
}

/**
 * Review flagged content — approve, remove, or escalate.
 */
export async function reviewContent(
  moderatorId: string,
  contentId: string,
  action: ModerationAction,
): Promise<void> {
  await query(
    `UPDATE flagged_content
     SET reviewed_by = $1, action = $2, reviewed_at = NOW()
     WHERE id = $3`,
    [moderatorId, action, contentId],
  );

  // Get the associated post ID
  const rows = await query<{ post_id: string }>(
    `SELECT post_id FROM flagged_content WHERE id = $1`,
    [contentId],
  );
  if (rows.length === 0) return;

  const postId = rows[0].post_id;

  // Update post moderation status based on action
  const statusMap: Record<ModerationAction, string> = {
    approve: 'approved',
    remove: 'removed',
    escalate: 'flagged', // stays flagged for admin review
  };

  await query(
    `UPDATE posts SET moderation_status = $1 WHERE id = $2`,
    [statusMap[action], postId],
  );
}

/**
 * Verify that a user has the peer_moderator role.
 */
export async function verifyModeratorTraining(userId: string): Promise<boolean> {
  const rows = await query<UserRow>(
    `SELECT id, role FROM users WHERE id = $1`,
    [userId],
  );
  if (rows.length === 0) return false;
  return rows[0].role === 'peer_moderator' || rows[0].role === 'admin';
}
