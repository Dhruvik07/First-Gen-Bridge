import { type NextRequest } from 'next/server';
import {
  startOnboarding,
  submitStep,
  resumeOnboarding,
  completeOnboarding,
} from '@/services/onboarding';
import type { OnboardingStepData } from '@/types/onboarding';

/**
 * GET — Resume an incomplete onboarding session.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    const session = await resumeOnboarding(userId);
    if (!session) {
      return Response.json({ session: null });
    }

    // Convert Map to plain object for JSON serialization
    const stepDataObj: Record<string, unknown> = {};
    session.stepData.forEach((v, k) => { stepDataObj[k] = v; });

    return Response.json({
      session: { ...session, stepData: stepDataObj },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to resume onboarding';
    return Response.json({ error: message }, { status: 500 });
  }
}

/**
 * POST — Start onboarding, submit a step, or complete onboarding.
 * Body: { action: 'start' | 'submit' | 'complete', userId?, sessionId?, stepData? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, sessionId, stepData } = body as {
      action: 'start' | 'submit' | 'complete';
      userId?: string;
      sessionId?: string;
      stepData?: OnboardingStepData;
    };

    if (action === 'start') {
      if (!userId) {
        return Response.json({ error: 'userId is required' }, { status: 400 });
      }
      const session = await startOnboarding(userId);
      const stepDataObj: Record<string, unknown> = {};
      session.stepData.forEach((v, k) => { stepDataObj[k] = v; });
      return Response.json({ session: { ...session, stepData: stepDataObj } }, { status: 201 });
    }

    if (action === 'submit') {
      if (!sessionId || !stepData) {
        return Response.json(
          { error: 'sessionId and stepData are required' },
          { status: 400 },
        );
      }
      const session = await submitStep(sessionId, stepData);
      const stepDataObj: Record<string, unknown> = {};
      session.stepData.forEach((v, k) => { stepDataObj[k] = v; });
      return Response.json({ session: { ...session, stepData: stepDataObj } });
    }

    if (action === 'complete') {
      if (!sessionId) {
        return Response.json({ error: 'sessionId is required' }, { status: 400 });
      }
      const result = await completeOnboarding(sessionId);
      return Response.json({ result });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onboarding operation failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
