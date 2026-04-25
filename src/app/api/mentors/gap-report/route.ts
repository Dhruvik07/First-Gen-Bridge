import { submitSystemicGapReport } from '@/services/mentor';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mentorId, description, institutionId } = body;

    if (!mentorId || !description || !institutionId) {
      return Response.json(
        { error: 'mentorId, description, and institutionId are required' },
        { status: 400 },
      );
    }

    await submitSystemicGapReport(mentorId, { description, institutionId });
    return Response.json({ success: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to submit gap report';
    return Response.json({ error: message }, { status: 500 });
  }
}
