import { submitReview } from '@/services/resource';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: resourceId } = await params;
    const body = await request.json();
    const { studentId, content } = body;

    if (!studentId || !content) {
      return Response.json(
        { error: 'studentId and content are required' },
        { status: 400 },
      );
    }

    const review = await submitReview(resourceId, { studentId, content });
    return Response.json({ review }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to submit review';
    return Response.json({ error: message }, { status: 500 });
  }
}
