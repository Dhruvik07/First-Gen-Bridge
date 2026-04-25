import { type NextRequest } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const connectionId = request.nextUrl.searchParams.get('connectionId');
    if (!connectionId) {
      return Response.json({ error: 'connectionId is required' }, { status: 400 });
    }

    // Placeholder: video sessions would be in their own table
    return Response.json({ sessions: [], connectionId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch sessions';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { connectionId, scheduledAt, duration } = body;

    if (!connectionId || !scheduledAt) {
      return Response.json(
        { error: 'connectionId and scheduledAt are required' },
        { status: 400 },
      );
    }

    // Verify connection is active
    const connections = await query(
      `SELECT * FROM mentorship_connections WHERE id = $1 AND status = 'active'`,
      [connectionId],
    );

    if (connections.length === 0) {
      return Response.json({ error: 'No active connection found' }, { status: 404 });
    }

    // Placeholder: store session in a sessions table when available
    return Response.json({
      session: {
        connectionId,
        scheduledAt,
        duration: duration ?? 30,
        createdAt: new Date().toISOString(),
      },
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to schedule session';
    return Response.json({ error: message }, { status: 500 });
  }
}
