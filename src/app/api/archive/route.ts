import { type NextRequest } from 'next/server';
import {
  logAccomplishment,
  getArchive,
  shareToWinBoard,
} from '@/services/archive';
import type { ArchiveEntry } from '@/types/archive';

/**
 * GET — List archive entries for a student.
 */
export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');

    if (!studentId) {
      return Response.json({ error: 'studentId is required' }, { status: 400 });
    }

    const entries = await getArchive(studentId);
    return Response.json({ entries });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get archive';
    return Response.json({ error: message }, { status: 500 });
  }
}

/**
 * POST — Log an accomplishment or share an entry to the Win Board.
 * Body: { action: 'log' | 'share', studentId?, accomplishment?, entryId? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, studentId, accomplishment, entryId } = body as {
      action: 'log' | 'share';
      studentId?: string;
      accomplishment?: { type: ArchiveEntry['type']; description: string };
      entryId?: string;
    };

    if (action === 'log') {
      if (!studentId || !accomplishment?.type || !accomplishment?.description) {
        return Response.json(
          { error: 'studentId and accomplishment (type, description) are required' },
          { status: 400 },
        );
      }
      const entry = await logAccomplishment(studentId, accomplishment);
      return Response.json({ entry }, { status: 201 });
    }

    if (action === 'share') {
      if (!entryId) {
        return Response.json({ error: 'entryId is required' }, { status: 400 });
      }
      const entry = await shareToWinBoard(entryId);
      return Response.json({ entry });
    }

    return Response.json({ error: 'Invalid action. Use "log" or "share".' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Archive operation failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
