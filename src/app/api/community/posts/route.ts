import { type NextRequest } from 'next/server';
import { getChannelPosts } from '@/services/community';

/** GET — Get approved posts for a channel. */
export async function GET(request: NextRequest) {
  try {
    const channelId = request.nextUrl.searchParams.get('channelId');

    if (!channelId) {
      return Response.json({ error: 'channelId query param is required' }, { status: 400 });
    }

    const posts = await getChannelPosts(channelId);
    return Response.json({ posts });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch posts';
    return Response.json({ error: message }, { status: 500 });
  }
}
