import { type NextRequest } from 'next/server';
import { postToWinBoard, getChannelPosts, listChannels } from '@/services/community';
import type { Achievement } from '@/types/community';

/** GET — Get Win Board posts. */
export async function GET(_request: NextRequest) {
  try {
    // Find the win_board channel
    const channels = await listChannels('win_board');
    if (channels.length === 0) {
      return Response.json({ posts: [] });
    }

    const posts = await getChannelPosts(channels[0].id);
    return Response.json({ posts });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch win board';
    return Response.json({ error: message }, { status: 500 });
  }
}

/** POST — Share an achievement to the Win Board. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, achievement } = body as {
      studentId: string;
      achievement: Achievement;
    };

    if (!studentId || !achievement?.description || !achievement?.type) {
      return Response.json(
        { error: 'studentId and achievement (with description and type) are required' },
        { status: 400 },
      );
    }

    const post = await postToWinBoard(studentId, achievement);
    return Response.json({ post }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to post to win board';
    return Response.json({ error: message }, { status: 500 });
  }
}
