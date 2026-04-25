import { getTopMatches } from '@/services/matching';
import { listAvailableMentors } from '@/services/mentor';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentProfile, institutionId, count } = body;

    if (!studentProfile || !institutionId) {
      return Response.json(
        { error: 'studentProfile and institutionId are required' },
        { status: 400 },
      );
    }

    const mentors = await listAvailableMentors(institutionId);

    if (mentors.length === 0) {
      return Response.json({
        matches: [],
        message: 'No mentors available. You have been added to the waiting list. Check out Community Space channels in the meantime.',
      });
    }

    const matches = getTopMatches(studentProfile, mentors, count ?? 3);
    return Response.json({ matches });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Matching failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
