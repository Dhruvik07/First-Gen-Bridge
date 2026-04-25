import { type NextRequest } from 'next/server';
import { listAvailableMentors, submitRegistration } from '@/services/mentor';

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.nextUrl.searchParams.get('institutionId');
    if (!institutionId) {
      return Response.json({ error: 'institutionId is required' }, { status: 400 });
    }

    const mentors = await listAvailableMentors(institutionId);
    return Response.json({ mentors });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to list mentors';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, registrationData } = body;

    if (!userId || !registrationData) {
      return Response.json({ error: 'userId and registrationData are required' }, { status: 400 });
    }

    const candidate = await submitRegistration(userId, registrationData);
    return Response.json({ candidate }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return Response.json({ error: message }, { status: 400 });
  }
}
