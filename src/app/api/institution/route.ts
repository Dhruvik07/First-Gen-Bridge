import { type NextRequest } from 'next/server';
import { getInstitutionDashboard } from '@/services/gap-report';

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.nextUrl.searchParams.get('institutionId');

    if (!institutionId) {
      return Response.json({ error: 'institutionId is required' }, { status: 400 });
    }

    const dashboard = await getInstitutionDashboard(institutionId);
    return Response.json(dashboard);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load institution dashboard';
    return Response.json({ error: message }, { status: 500 });
  }
}
