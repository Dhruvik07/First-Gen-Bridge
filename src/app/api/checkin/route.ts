import { type NextRequest } from 'next/server';
import {
  getWeeklyCheckIn,
  submitCheckIn,
  getSupportRecommendations,
  computeBelongingScore,
} from '@/services/checkin';

/**
 * GET — Get this week's check-in questionnaire for a student.
 */
export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');

    if (!studentId) {
      return Response.json({ error: 'studentId is required' }, { status: 400 });
    }

    const checkIn = await getWeeklyCheckIn(studentId);
    return Response.json({ checkIn });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get check-in';
    return Response.json({ error: message }, { status: 500 });
  }
}

/**
 * POST — Submit check-in responses and get belonging score + recommendations.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, responses } = body as {
      studentId: string;
      responses: Record<string, number | boolean | string>;
    };

    if (!studentId || !responses) {
      return Response.json(
        { error: 'studentId and responses are required' },
        { status: 400 },
      );
    }

    const score = await submitCheckIn(studentId, responses);

    // Compute recommendations if below threshold
    const belongingScore = computeBelongingScore(responses);
    const recommendations = getSupportRecommendations(belongingScore, {
      internationalStudent: false,
      parentingStatus: false,
      workSchedule: 'none',
      disabilityStatus: false,
      languagePreference: 'en',
      challenges: [],
      culturalBackground: [],
    });

    return Response.json({ score, recommendations }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to submit check-in';
    return Response.json({ error: message }, { status: 500 });
  }
}
