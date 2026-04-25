import { type NextRequest } from 'next/server';
import { searchResources } from '@/services/resource';
import type { PersonalizationProfile } from '@/types/student';

const defaultProfile: PersonalizationProfile = {
  internationalStudent: false,
  parentingStatus: false,
  workSchedule: 'none',
  disabilityStatus: false,
  languagePreference: 'en',
  challenges: [],
  culturalBackground: [],
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') ?? '';
    const institutionId = searchParams.get('institutionId');

    if (!institutionId) {
      return Response.json({ error: 'institutionId is required' }, { status: 400 });
    }

    // TODO: Extract profile from authenticated session for personalization
    const profile = defaultProfile;

    const resources = await searchResources(q, profile, institutionId);
    return Response.json({ resources });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to search resources';
    return Response.json({ error: message }, { status: 500 });
  }
}
