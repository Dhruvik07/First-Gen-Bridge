import { register } from '@/services/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role, institutionId, preferredLanguage } = body;

    if (!email || !password || !name || !role || !institutionId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { user, session } = await register({
      email,
      password,
      name,
      role,
      institutionId,
      preferredLanguage: preferredLanguage ?? 'en',
    });

    return Response.json({ user, session }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return Response.json({ error: message }, { status: 400 });
  }
}
