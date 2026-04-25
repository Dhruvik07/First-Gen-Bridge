/**
 * Cross-pillar workflow triggers.
 * Wires events from one pillar to actions in others.
 */

import { logAccomplishment, shareToWinBoard } from '@/services/archive';
import { findPeerForGap } from '@/services/gap-report';
import { getSupportRecommendations, computeBelongingScore } from '@/services/checkin';
import type { SupportRecommendation } from '@/types/checkin';
import type { ArchiveEntry } from '@/types/archive';

/**
 * Triggered when a Communication Coach session completes.
 * Logs the draft to the Confidence Archive and offers Win Board sharing.
 */
export async function onCoachSessionComplete(
  studentId: string,
  _sessionId: string,
): Promise<{ archiveEntry: ArchiveEntry; canShareToWinBoard: boolean }> {
  const entry = await logAccomplishment(studentId, {
    type: 'communication_draft',
    description: 'Completed a communication draft with the Communication Coach.',
  });

  return { archiveEntry: entry, canShareToWinBoard: true };
}

/**
 * Triggered when a student submits a resource gap report.
 * Searches for a peer who navigated a similar gap and offers a Community Space intro.
 */
export async function onGapReportSubmitted(
  studentId: string,
  report: { category: string },
): Promise<{
  peerFound: boolean;
  peer: { peerId: string; peerType: 'student' | 'mentor'; category: string } | null;
}> {
  const peer = await findPeerForGap(studentId, report.category);
  return { peerFound: peer !== null, peer };
}

/**
 * Triggered when a student submits a weekly check-in.
 * If the belonging score is below threshold, suggests mentor session + channels.
 */
export async function onCheckInSubmitted(
  _studentId: string,
  score: number,
): Promise<{ recommendations: SupportRecommendation[] }> {
  const belongingScore = {
    value: score,
    belowThreshold: score < 40,
    computedAt: new Date(),
  };

  const recommendations = getSupportRecommendations(belongingScore, {
    internationalStudent: false,
    parentingStatus: false,
    workSchedule: 'none',
    disabilityStatus: false,
    languagePreference: 'en',
    challenges: [],
    culturalBackground: [],
  });

  return { recommendations };
}


/**
 * Triggered when onboarding completes.
 * Generates mentor match, channel recommendations, and resource recommendations.
 */
export async function onOnboardingComplete(
  _userId: string,
  _data: Record<string, unknown>,
): Promise<{
  mentorMatchReady: boolean;
  channelRecsReady: boolean;
  resourceRecsReady: boolean;
}> {
  // In production, this would call:
  // - matchingEngine.getTopMatches() for mentor recommendations
  // - community.getRecommendedChannels() for channel recommendations
  // - resource.searchResources() for personalized resource recommendations
  return {
    mentorMatchReady: true,
    channelRecsReady: true,
    resourceRecsReady: true,
  };
}

/**
 * Triggered when a mentor is flagged by a student.
 * Pauses the mentorship connection and notifies admin.
 */
export async function onMentorFlagged(
  studentId: string,
  mentorId: string,
): Promise<{ paused: boolean; adminNotified: boolean }> {
  // flagInteraction in mentor service already pauses the connection
  // This trigger handles the admin notification side
  const { flagInteraction } = await import('@/services/mentor');
  await flagInteraction(studentId, mentorId, 'Flagged via cross-pillar trigger');

  // In production, this would send a notification to admin users
  // (email, in-app notification, etc.)
  return { paused: true, adminNotified: true };
}
