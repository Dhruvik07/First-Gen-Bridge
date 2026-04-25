import { moderateContent } from '@/services/ai-router';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body as { content: string };

    if (!content) {
      return Response.json({ error: 'content is required' }, { status: 400 });
    }

    const result = await moderateContent(content);
    return Response.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Moderation failed';
    return Response.json({ error: msg }, { status: 500 });
  }
}
