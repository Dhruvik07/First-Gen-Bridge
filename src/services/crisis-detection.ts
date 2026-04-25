import { query } from '@/lib/db';
import type { CrisisDetection, CrisisResource } from '@/types/ai';

// ── Crisis keyword patterns ──

const CRISIS_PATTERNS: RegExp[] = [
  /\b(suicid|kill\s*(my)?self|end\s*(my\s*)?life|don'?t\s*want\s*to\s*(be\s*)?alive)\b/i,
  /\b(self[- ]?harm|hurt\s*(my)?self|cutting\s*(my)?self)\b/i,
  /\b(hopeless|no\s*reason\s*to\s*live|give\s*up\s*on\s*(everything|life))\b/i,
  /\b(completely\s*alone|nobody\s*cares|no\s*one\s*(would\s*)?miss\s*me)\b/i,
  /\b(end\s*it\s*all|better\s*off\s*(dead|without\s*me))\b/i,
];

/**
 * Detect crisis language in text.
 * Checks for keywords/patterns related to hopelessness, self-harm, isolation, and suicidal ideation.
 */
export async function detectCrisis(
  text: string,
  institutionId?: string,
): Promise<CrisisDetection> {
  const detected = CRISIS_PATTERNS.some((pattern) => pattern.test(text));

  if (!detected) {
    return { detected: false, crisisResource: null, acknowledged: false };
  }

  // Fetch crisis resources if institution ID is provided
  let crisisResource: CrisisResource | null = null;
  if (institutionId) {
    const resources = await getCrisisResources(institutionId);
    crisisResource = resources.length > 0 ? resources[0] : null;
  }

  // Provide a default crisis resource if none found for the institution
  if (!crisisResource) {
    crisisResource = {
      institutionId: institutionId ?? 'default',
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      description: 'Free, confidential support 24/7. Call or text 988.',
      available24h: true,
    };
  }

  return { detected: true, crisisResource, acknowledged: false };
}

/**
 * Query crisis resources for a specific institution.
 */
export async function getCrisisResources(institutionId: string): Promise<CrisisResource[]> {
  interface CrisisResourceRow {
    institution_id: string;
    name: string;
    phone: string;
    description: string;
    available_24h: boolean;
  }

  const rows = await query<CrisisResourceRow>(
    `SELECT institution_id, name, phone, description, available_24h
     FROM crisis_resources
     WHERE institution_id = $1
     ORDER BY available_24h DESC, name ASC`,
    [institutionId],
  );

  return rows.map((row) => ({
    institutionId: row.institution_id,
    name: row.name,
    phone: row.phone,
    description: row.description,
    available24h: row.available_24h,
  }));
}
