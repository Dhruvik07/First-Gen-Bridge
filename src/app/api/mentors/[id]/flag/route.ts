import { flagInteraction } from '@/services/mentor';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: mentorId } = await params;
    const body = await request.json();
    const { studentId, reason } = body;

    if (!studentId || !reason) {
      return Response.json({ error: 'studentId and reason are required' }, { status: 400 });
    }

    await flagInteraction(studentId, mentorId, reason);
    return Response.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to flag interaction';
    return Response.json({ error: message }, { status: 500 });
  }
}
