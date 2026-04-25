import { type NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { filterContactInfo } from '@/services/messaging';

export async function GET(request: NextRequest) {
  try {
    const connectionId = request.nextUrl.searchParams.get('connectionId');
    if (!connectionId) {
      return Response.json({ error: 'connectionId is required' }, { status: 400 });
    }

    // Messages are stored in a simple table — for now query mentorship_connections
    // to verify the connection exists, then return messages
    const rows = await query(
      `SELECT * FROM mentorship_connections WHERE id = $1`,
      [connectionId],
    );

    if (rows.length === 0) {
      return Response.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Placeholder: in a full implementation, messages would be in their own table
    return Response.json({ messages: [], connectionId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch messages';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { connectionId, senderId, content } = body;

    if (!connectionId || !senderId || !content) {
      return Response.json(
        { error: 'connectionId, senderId, and content are required' },
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

    // Filter personal contact info from message content
    const filteredContent = filterContactInfo(content);

    // Placeholder: store message in a messages table when available
    return Response.json({
      message: {
        connectionId,
        senderId,
        content: filteredContent,
        createdAt: new Date().toISOString(),
      },
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send message';
    return Response.json({ error: message }, { status: 500 });
  }
}
