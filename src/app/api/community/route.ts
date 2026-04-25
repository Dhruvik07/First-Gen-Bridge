import { type NextRequest } from 'next/server';
import { listChannels, createPost } from '@/services/community';
import type { ChannelCategory } from '@/types/community';

/** GET — List all channels, optionally filtered by category query param. */
export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') as ChannelCategory | null;
    const channels = await listChannels(category ?? undefined);
    return Response.json({ channels });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to list channels';
    return Response.json({ error: message }, { status: 500 });
  }
}

/** POST — Create a new post in a channel. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channelId, authorId, content, anonymous } = body as {
      channelId: string;
      authorId: string;
      content: string;
      anonymous: boolean;
    };

    if (!channelId || !authorId || !content) {
      return Response.json(
        { error: 'channelId, authorId, and content are required' },
        { status: 400 },
      );
    }

    const post = await createPost(channelId, authorId, {
      content,
      anonymous: anonymous ?? false,
    });

    return Response.json({ post }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create post';
    return Response.json({ error: message }, { status: 500 });
  }
}
