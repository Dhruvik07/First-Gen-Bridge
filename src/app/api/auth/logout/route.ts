import { logout } from '@/services/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return Response.json({ error: 'Session token is required' }, { status: 400 });
    }

    await logout(sessionToken);
    return Response.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Logout failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
