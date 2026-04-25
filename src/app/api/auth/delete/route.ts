import { requestAccountDeletion } from '@/services/auth';

/**
 * POST — Request account deletion.
 * Marks the account for deletion and schedules data removal within 30 days.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body as { userId: string };

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    const result = await requestAccountDeletion(userId);

    return Response.json({
      message: 'Account deletion scheduled. All data will be removed within 30 days.',
      scheduledAt: result.scheduledAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to process deletion request';
    return Response.json({ error: message }, { status: 500 });
  }
}
