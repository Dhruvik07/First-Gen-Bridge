import { login } from '@/services/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { user, session } = await login({ email, password });
    return Response.json({ user, session });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return Response.json({ error: message }, { status: 401 });
  }
}
