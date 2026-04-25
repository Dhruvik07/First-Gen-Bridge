import { type NextRequest } from 'next/server';
import { verifySession } from '@/services/auth';

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return Response.json({ error: 'No session token provided' }, { status: 401 });
  }

  try {
    const user = await verifySession(token);
    if (!user) {
      return Response.json({ error: 'Invalid or expired session' }, { status: 401 });
    }
    return Response.json({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Session verification failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
