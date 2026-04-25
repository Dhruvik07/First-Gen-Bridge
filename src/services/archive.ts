import { query } from '@/lib/db';
import type { ArchiveEntry } from '@/types/archive';

// ── Row types ──

interface ArchiveRow {
  id: string;
  student_id: string;
  type: ArchiveEntry['type'];
  description: string;
  shared_to_win_board: boolean;
  created_at: Date;
}

function toArchiveEntry(row: ArchiveRow): ArchiveEntry {
  return {
    id: row.id,
    studentId: row.student_id,
    type: row.type,
    description: row.description,
    sharedToWinBoard: row.shared_to_win_board,
    createdAt: row.created_at,
  };
}

/**
 * Log an accomplishment to the Confidence Archive.
 */
export async function logAccomplishment(
  studentId: string,
  accomplishment: { type: ArchiveEntry['type']; description: string },
): Promise<ArchiveEntry> {
  const rows = await query<ArchiveRow>(
    `INSERT INTO archive_entries (student_id, type, description, shared_to_win_board)
     VALUES ($1, $2, $3, false)
     RETURNING *`,
    [studentId, accomplishment.type, accomplishment.description],
  );

  return toArchiveEntry(rows[0]);
}

/**
 * Get all archive entries for a student.
 */
export async function getArchive(studentId: string): Promise<ArchiveEntry[]> {
  const rows = await query<ArchiveRow>(
    `SELECT * FROM archive_entries
     WHERE student_id = $1
     ORDER BY created_at DESC`,
    [studentId],
  );

  return rows.map(toArchiveEntry);
}

/**
 * Share an archive entry to the Win Board.
 * Updates the entry and creates a win board post.
 */
export async function shareToWinBoard(entryId: string): Promise<ArchiveEntry> {
  // Mark the entry as shared
  const rows = await query<ArchiveRow>(
    `UPDATE archive_entries SET shared_to_win_board = true
     WHERE id = $1
     RETURNING *`,
    [entryId],
  );

  if (rows.length === 0) {
    throw new Error('Archive entry not found');
  }

  const entry = rows[0];

  // Create a win board post via the community posts table
  const winChannels = await query<{ id: string }>(
    `SELECT id FROM channels WHERE category = 'win_board' LIMIT 1`,
  );

  if (winChannels.length > 0) {
    await query(
      `INSERT INTO posts (channel_id, author_id, anonymous, content, moderation_status)
       VALUES ($1, $2, false, $3, 'approved')`,
      [winChannels[0].id, entry.student_id, entry.description],
    );
  }

  return toArchiveEntry(entry);
}
