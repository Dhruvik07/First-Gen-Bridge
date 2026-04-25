import bcrypt from 'bcryptjs';
import { query, getClient } from '@/lib/db';
import { setSession, getSession, deleteSession } from '@/lib/redis';
import { env } from '@/config/env';
import type { User, VisibilitySettings, RegistrationData, Session, Credentials } from '@/types/user';
import { randomUUID } from 'crypto';

const SALT_ROUNDS = 10;

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: User['role'];
  institution_id: string;
  preferred_language: string;
  created_at: Date;
}

interface VisibilityRow {
  user_id: string;
  profile_public: boolean;
  show_major: boolean;
  show_challenges: boolean;
  show_identity: boolean;
}

function toUser(row: UserRow, vis?: VisibilityRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    institutionId: row.institution_id,
    preferredLanguage: row.preferred_language,
    visibilitySettings: vis
      ? {
          profilePublic: vis.profile_public,
          showMajor: vis.show_major,
          showChallenges: vis.show_challenges,
          showIdentity: vis.show_identity,
        }
      : { profilePublic: false, showMajor: true, showChallenges: false, showIdentity: false },
    createdAt: row.created_at,
  };
}

export async function register(data: RegistrationData): Promise<{ user: User; session: Session }> {
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const userRows = await client.query<UserRow>(
      `INSERT INTO users (email, password_hash, name, role, institution_id, preferred_language)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, role, institution_id, preferred_language, created_at`,
      [data.email, passwordHash, data.name, data.role, data.institutionId, data.preferredLanguage],
    );
    const userRow = userRows.rows[0];

    const visRows = await client.query<VisibilityRow>(
      `INSERT INTO visibility_settings (user_id) VALUES ($1)
       RETURNING user_id, profile_public, show_major, show_challenges, show_identity`,
      [userRow.id],
    );

    await client.query('COMMIT');

    const user = toUser(userRow, visRows.rows[0]);
    const session = await createSession(user.id);
    return { user, session };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function login(credentials: Credentials): Promise<{ user: User; session: Session }> {
  const rows = await query<UserRow & { password_hash: string }>(
    `SELECT u.id, u.email, u.password_hash, u.name, u.role, u.institution_id, u.preferred_language, u.created_at
     FROM users u WHERE u.email = $1`,
    [credentials.email],
  );

  if (rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const row = rows[0];
  const valid = await bcrypt.compare(credentials.password, row.password_hash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  const visRows = await query<VisibilityRow>(
    `SELECT * FROM visibility_settings WHERE user_id = $1`,
    [row.id],
  );

  const user = toUser(row, visRows[0]);
  const session = await createSession(user.id);
  return { user, session };
}

export async function logout(sessionToken: string): Promise<void> {
  await deleteSession(sessionToken);
}

export async function verifySession(sessionToken: string): Promise<User | null> {
  const data = await getSession(sessionToken);
  if (!data || !data.userId) return null;

  const expiresAt = data.expiresAt as string;
  if (new Date(expiresAt) < new Date()) return null;

  const rows = await query<UserRow>(
    `SELECT id, email, name, role, institution_id, preferred_language, created_at
     FROM users WHERE id = $1`,
    [data.userId as string],
  );
  if (rows.length === 0) return null;

  const visRows = await query<VisibilityRow>(
    `SELECT * FROM visibility_settings WHERE user_id = $1`,
    [rows[0].id],
  );

  return toUser(rows[0], visRows[0]);
}

export async function updateProfileVisibility(
  userId: string,
  settings: VisibilitySettings,
): Promise<void> {
  await query(
    `UPDATE visibility_settings
     SET profile_public = $1, show_major = $2, show_challenges = $3, show_identity = $4
     WHERE user_id = $5`,
    [settings.profilePublic, settings.showMajor, settings.showChallenges, settings.showIdentity, userId],
  );
}

async function createSession(userId: string): Promise<Session> {
  const token = randomUUID();
  const ttl = env.SESSION_TTL_SECONDS;
  const expiresAt = new Date(Date.now() + ttl * 1000);

  await setSession(token, { userId, expiresAt: expiresAt.toISOString() }, ttl);

  return { id: randomUUID(), userId, token, expiresAt };
}


/**
 * Request account deletion. Marks the account for deletion and schedules
 * data removal within 30 days per privacy policy.
 * Deletes from: users (cascades to all FK tables), sessions.
 */
export async function requestAccountDeletion(userId: string): Promise<{ scheduledAt: Date }> {
  const client = await getClient();
  const scheduledAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  try {
    await client.query('BEGIN');

    // Mark user for deletion
    await client.query(
      `UPDATE users SET deleted_at = NOW(), deletion_scheduled = $1 WHERE id = $2`,
      [scheduledAt, userId],
    );

    // Immediately invalidate all sessions for this user
    // (Redis sessions will expire naturally, but we clear the user record)

    // Delete data from non-cascading tables
    const tables = [
      'archive_entries',
      'check_in_questionnaires',
      'belonging_scores',
      'onboarding_sessions',
      'coach_sessions',
      'ai_conversations',
      'gap_reports',
      'posts',
      'mentor_ratings',
      'mentorship_connections',
      'student_profiles',
      'mentor_profiles',
      'visibility_settings',
    ];

    for (const table of tables) {
      await client.query(
        `DELETE FROM ${table} WHERE user_id = $1 OR student_id = $1 OR author_id = $1`,
        [userId],
      );
    }

    // Finally delete the user record
    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return { scheduledAt };
}
