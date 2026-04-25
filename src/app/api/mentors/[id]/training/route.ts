import { completeTraining } from '@/services/mentor';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: candidateId } = await params;
    const body = await request.json();
    const { results } = body;

    if (!results) {
      return Response.json({ error: 'Training results are required' }, { status: 400 });
    }

    const verification = await completeTraining(candidateId, results);
    return Response.json({ verification });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to complete training';
    return Response.json({ error: message }, { status: 500 });
  }
}
