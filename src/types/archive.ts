export interface ArchiveEntry {
  id: string;
  studentId: string;
  type: 'communication_draft' | 'mentor_session' | 'community_contribution' | 'custom';
  description: string;
  sharedToWinBoard: boolean;
  createdAt: Date;
}

export { type Achievement } from './community';
