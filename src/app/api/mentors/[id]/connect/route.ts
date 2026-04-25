import { query } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: mentorId } = await params;
    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return Response.json({ error: 'studentId is required' }, { status: 400 });
    }

    // Check for existing active/pending connection
    const existing = await query(
      `SELECT id FROM mentorship_connections
       WHERE student_id = $1 AND mentor_id = $2 AND status IN ('pending', 'active')`,
      [studentId, mentorId],
    );

    if (existing.length > 0) {
      return Response.json({ error: 'Connection already exists' }, { status: 409 });
    }

    // Create mentorship connection with status 'pending'
    const rows = await query(
      `INSERT INTO mentorship_connections (student_id, mentor_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, student_id, mentor_id, status, created_at`,
      [studentId, mentorId],
    );

    return Response.json({ connection: rows[0] }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create connection';
    return Response.json({ error: message }, { status: 500 });
  }
}
