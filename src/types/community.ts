export type ChannelCategory = 'major' | 'identity' | 'challenge' | 'win_board';

export type ModerationAction = 'approve' | 'remove' | 'escalate';

export interface Channel {
  id: string;
  name: string;
  category: ChannelCategory;
  description: string;
}

export interface Post {
  id: string;
  channelId: string;
  authorId: string;
  anonymous: boolean;
  content: string;
  moderationStatus: 'pending' | 'approved' | 'flagged' | 'removed';
  createdAt: Date;
}

export interface FlaggedContent {
  id: string;
  postId: string;
  reason: string;
  aiConfidence: number;
  reviewedBy: string | null;
  action: ModerationAction | null;
  flaggedAt: Date;
  reviewedAt: Date | null;
}

export interface StudyBuddyMatch {
  studentId: string;
  matchedStudentId: string;
  major: string;
  course: string;
}

export interface Achievement {
  description: string;
  type: 'communication_draft' | 'mentor_session' | 'community_contribution' | 'custom';
}

export interface PostData {
  content: string;
  anonymous: boolean;
}
