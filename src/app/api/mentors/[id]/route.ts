import { getMentorProfile } from '@/services/mentor';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const profile = await getMentorProfile(id);

    if (!profile) {
      return Response.json({ error: 'Mentor not found' }, { status: 404 });
    }

    return Response.json({ profile });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get mentor profile';
    return Response.json({ error: message }, { status: 500 });
  }
}
