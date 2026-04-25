import {
  getFlaggedQueue,
  reviewContent,
  verifyModeratorTraining,
} from '@/services/moderation';
import type { ModerationAction } from '@/types/community';

/** GET — Retrieve the flagged content queue for moderator review. */
export async function GET() {
  try {
    const queue = await getFlaggedQueue();
    return Response.json(queue);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch flagged queue';
    return Response.json({ error: msg }, { status: 500 });
  }
}

/** POST — Submit a moderation review action (approve, remove, escalate). */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { moderatorId, contentId, action } = body as {
      moderatorId: string;
      contentId: string;
      action: ModerationAction;
    };

    if (!moderatorId || !contentId || !action) {
      return Response.json(
        { error: 'moderatorId, contentId, and action are required' },
        { status: 400 },
      );
    }

    const validActions: ModerationAction[] = ['approve', 'remove', 'escalate'];
    if (!validActions.includes(action)) {
      return Response.json(
        { error: `action must be one of: ${validActions.join(', ')}` },
        { status: 400 },
      );
    }

    // Verify the user is a moderator
    const isModerator = await verifyModeratorTraining(moderatorId);
    if (!isModerator) {
      return Response.json({ error: 'User is not a verified moderator' }, { status: 403 });
    }

    await reviewContent(moderatorId, contentId, action);
    return Response.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Review action failed';
    return Response.json({ error: msg }, { status: 500 });
  }
}
