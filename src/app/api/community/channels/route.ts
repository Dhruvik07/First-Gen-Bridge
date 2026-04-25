import { type NextRequest } from 'next/server';
import { listChannels, getRecommendedChannels } from '@/services/community';
import type { ChannelCategory } from '@/types/community';
import type { PersonalizationProfile } from '@/types/student';

/** GET — List channels with optional category filter or profile-based recommendations. */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as ChannelCategory | null;
    const recommend = searchParams.get('recommend');

    // If recommend=true and profile params are provided, return recommended channels
    if (recommend === 'true') {
      const profile: PersonalizationProfile = {
        internationalStudent: searchParams.get('internationalStudent') === 'true',
        parentingStatus: searchParams.get('parentingStatus') === 'true',
        workSchedule: (searchParams.get('workSchedule') ?? 'none') as PersonalizationProfile['workSchedule'],
        disabilityStatus: searchParams.get('disabilityStatus') === 'true',
        languagePreference: searchParams.get('languagePreference') ?? 'en',
        challenges: searchParams.get('challenges')?.split(',').filter(Boolean) as PersonalizationProfile['challenges'] ?? [],
        culturalBackground: searchParams.get('culturalBackground')?.split(',').filter(Boolean) ?? [],
      };

      const channels = await getRecommendedChannels(profile);
      return Response.json({ channels });
    }

    const channels = await listChannels(category ?? undefined);
    return Response.json({ channels });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to list channels';
    return Response.json({ error: message }, { status: 500 });
  }
}
