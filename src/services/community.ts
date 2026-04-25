import { query } from '@/lib/db';
import { flagContent } from '@/services/moderation';
import type {
  Channel,
  ChannelCategory,
  Post,
  PostData,
  StudyBuddyMatch,
  Achievement,
} from '@/types/community';
import type { PersonalizationProfile } from '@/types/student';

// ── Row types ──

interface ChannelRow {
  id: string;
  name: string;
  category: ChannelCategory;
  description: string;
}

interface PostRow {
  id: string;
  channel_id: string;
  author_id: string;
  anonymous: boolean;
  content: string;
  moderation_status: string;
  created_at: Date;
}

interface StudentProfileRow {
  user_id: string;
  major: string;
}

// ── Helpers ──

function toChannel(row: ChannelRow): Channel {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
  };
}

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    channelId: row.channel_id,
    authorId: row.anonymous ? 'anonymous' : row.author_id,
    anonymous: row.anonymous,
    content: row.content,
    moderationStatus: row.moderation_status as Post['moderationStatus'],
    createdAt: row.created_at,
  };
}

// ── Service functions ──

/**
 * List channels, optionally filtered by category.
 */
export async function listChannels(category?: ChannelCategory): Promise<Channel[]> {
  if (category) {
    const rows = await query<ChannelRow>(
      'SELECT * FROM channels WHERE category = $1 ORDER BY name',
      [category],
    );
    return rows.map(toChannel);
  }
  const rows = await query<ChannelRow>('SELECT * FROM channels ORDER BY category, name');
  return rows.map(toChannel);
}

/**
 * Get recommended channels based on a student's PersonalizationProfile.
 * Matches channels by major, challenges, and identity attributes.
 */
export async function getRecommendedChannels(
  profile: PersonalizationProfile,
): Promise<Channel[]> {
  const allChannels = await query<ChannelRow>(
    'SELECT * FROM channels ORDER BY category, name',
  );

  const recommended: Channel[] = [];
  const seen = new Set<string>();

  for (const row of allChannels) {
    const nameLower = row.name.toLowerCase();
    const descLower = row.description.toLowerCase();
    let match = false;

    // Match major-specific channels
    if (row.category === 'major') {
      match = true; // recommend all major channels; frontend can further filter
    }

    // Match identity channels based on profile
    if (row.category === 'identity') {
      if (profile.internationalStudent && (nameLower.includes('immigrant') || nameLower.includes('international'))) {
        match = true;
      }
      if (profile.parentingStatus && (nameLower.includes('parent') || descLower.includes('parent'))) {
        match = true;
      }
    }

    // Match challenge channels based on student challenges
    if (row.category === 'challenge') {
      for (const challenge of profile.challenges) {
        const keyword = challenge.replace(/_/g, ' ');
        if (nameLower.includes(keyword) || descLower.includes(keyword)) {
          match = true;
          break;
        }
      }
    }

    // Always recommend win_board
    if (row.category === 'win_board') {
      match = true;
    }

    if (match && !seen.has(row.id)) {
      seen.add(row.id);
      recommended.push(toChannel(row));
    }
  }

  return recommended;
}

/**
 * Create a post in a channel. Runs content through moderation.
 * Anonymous posts strip author identity from user-facing views.
 */
export async function createPost(
  channelId: string,
  authorId: string,
  postData: PostData,
): Promise<Post> {
  // Insert with pending moderation status
  const rows = await query<PostRow>(
    `INSERT INTO posts (channel_id, author_id, anonymous, content, moderation_status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING *`,
    [channelId, authorId, postData.anonymous, postData.content],
  );

  const post = rows[0];

  // Run through moderation service
  const modResult = await flagContent(post.id, postData.content);

  // If not flagged, auto-approve
  if (!modResult.flagged) {
    await query(
      `UPDATE posts SET moderation_status = 'approved' WHERE id = $1`,
      [post.id],
    );
    post.moderation_status = 'approved';
  }

  return toPost(post);
}

/**
 * Get posts for a channel. Only returns approved posts for public view.
 * Anonymous posts have authorId stripped.
 */
export async function getChannelPosts(channelId: string): Promise<Post[]> {
  const rows = await query<PostRow>(
    `SELECT * FROM posts
     WHERE channel_id = $1 AND moderation_status = 'approved'
     ORDER BY created_at DESC`,
    [channelId],
  );
  return rows.map(toPost);
}

/**
 * Match study buddies by major and course.
 * Returns students with the same major (course matching is best-effort via major).
 */
export async function matchStudyBuddy(
  studentId: string,
  major: string,
  course: string,
): Promise<StudyBuddyMatch[]> {
  const rows = await query<StudentProfileRow>(
    `SELECT user_id, major FROM student_profiles
     WHERE major ILIKE $1 AND user_id != $2
     LIMIT 10`,
    [`%${major}%`, studentId],
  );

  return rows.map((row) => ({
    studentId,
    matchedStudentId: row.user_id,
    major: row.major,
    course,
  }));
}

/**
 * Publish a weekly community prompt to all channels (or a designated prompt channel).
 * Inserts a system post into each channel.
 */
export async function publishWeeklyPrompt(): Promise<void> {
  const prompts = [
    "What's one thing you wish you'd known your first week?",
    'Share a resource that helped you this semester.',
    "What's a small win you had this week?",
    'What advice would you give to a first-gen student starting college?',
    "What's something about college life that surprised you?",
  ];

  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  // Get all channels
  const channels = await query<ChannelRow>('SELECT * FROM channels');

  // We need a system user to author prompts. Use a placeholder system author.
  // In production this would be a dedicated system user ID.
  for (const channel of channels) {
    // Check if a prompt was already posted this week
    const existing = await query<{ id: string }>(
      `SELECT id FROM posts
       WHERE channel_id = $1
         AND content LIKE '%[Weekly Prompt]%'
         AND created_at > NOW() - INTERVAL '7 days'
       LIMIT 1`,
      [channel.id],
    );

    if (existing.length === 0) {
      await query(
        `INSERT INTO posts (channel_id, author_id, anonymous, content, moderation_status)
         VALUES ($1, $1, true, $2, 'approved')`,
        [channel.id, `[Weekly Prompt] ${prompt}`],
      );
    }
  }
}

/**
 * Post an achievement to the Win Board channel and log to archive_entries.
 */
export async function postToWinBoard(
  studentId: string,
  achievement: Achievement,
): Promise<Post> {
  // Find or create the win_board channel
  let winChannels = await query<ChannelRow>(
    `SELECT * FROM channels WHERE category = 'win_board' LIMIT 1`,
  );

  if (winChannels.length === 0) {
    winChannels = await query<ChannelRow>(
      `INSERT INTO channels (name, category, description)
       VALUES ('Win Board', 'win_board', 'Celebrate your wins!')
       RETURNING *`,
    );
  }

  const winChannel = winChannels[0];

  // Create the post in the win board channel
  const postRows = await query<PostRow>(
    `INSERT INTO posts (channel_id, author_id, anonymous, content, moderation_status)
     VALUES ($1, $2, false, $3, 'approved')
     RETURNING *`,
    [winChannel.id, studentId, achievement.description],
  );

  // Also log to archive_entries
  await query(
    `INSERT INTO archive_entries (student_id, type, description, shared_to_win_board)
     VALUES ($1, $2, $3, true)`,
    [studentId, achievement.type, achievement.description],
  );

  return toPost(postRows[0]);
}
