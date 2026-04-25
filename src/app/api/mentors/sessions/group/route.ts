import { type NextRequest } from 'next/server';

const MAX_GROUP_SIZE = 5;

export async function GET(request: NextRequest) {
  try {
    const mentorId = request.nextUrl.searchParams.get('mentorId');
    if (!mentorId) {
      return Response.json({ error: 'mentorId is required' }, { status: 400 });
    }

    // Placeholder: group sessions would be in their own table
    return Response.json({ groupSessions: [], mentorId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch group sessions';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mentorId, studentIds, scheduledAt, topic } = body;

    if (!mentorId || !studentIds || !scheduledAt) {
      return Response.json(
        { error: 'mentorId, studentIds, and scheduledAt are required' },
        { status: 400 },
      );
    }

    if (!Array.isArray(studentIds) || studentIds.length > MAX_GROUP_SIZE) {
      return Response.json(
        { error: `Group sessions support a maximum of ${MAX_GROUP_SIZE} students` },
        { status: 400 },
      );
    }

    // Placeholder: store group session when table is available
    return Response.json({
      groupSession: {
        mentorId,
        studentIds,
        scheduledAt,
        topic: topic ?? '',
        maxStudents: MAX_GROUP_SIZE,
        createdAt: new Date().toISOString(),
      },
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create group session';
    return Response.json({ error: message }, { status: 500 });
  }
}
