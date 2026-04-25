import { submitGapReport } from '@/services/resource';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, institutionId, category, description } = body;

    if (!studentId || !institutionId || !category || !description) {
      return Response.json(
        { error: 'studentId, institutionId, category, and description are required' },
        { status: 400 },
      );
    }

    const report = await submitGapReport(studentId, {
      institutionId,
      category,
      description,
    });
    return Response.json({ report }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to submit gap report';
    return Response.json({ error: message }, { status: 500 });
  }
}
