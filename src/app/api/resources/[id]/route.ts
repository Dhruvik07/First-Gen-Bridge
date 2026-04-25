import { type NextRequest } from 'next/server';
import { getResourceCard } from '@/services/resource';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const resource = await getResourceCard(id);

    if (!resource) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    return Response.json({ resource });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get resource';
    return Response.json({ error: message }, { status: 500 });
  }
}
