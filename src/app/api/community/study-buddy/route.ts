import { matchStudyBuddy } from '@/services/community';

/** POST — Find study buddy matches by major and course. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, major, course } = body as {
      studentId: string;
      major: string;
      course: string;
    };

    if (!studentId || !major || !course) {
      return Response.json(
        { error: 'studentId, major, and course are required' },
        { status: 400 },
      );
    }

    const matches = await matchStudyBuddy(studentId, major, course);
    return Response.json({ matches });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to find study buddies';
    return Response.json({ error: message }, { status: 500 });
  }
}
