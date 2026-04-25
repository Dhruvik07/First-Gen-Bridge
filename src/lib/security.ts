/**
 * Security utilities for the FirstBridge platform.
 *
 * PostgreSQL encryption at rest should be configured at the database level:
 * - Use AWS RDS with storage encryption enabled (AES-256)
 * - Or configure dm-crypt / LUKS on self-hosted PostgreSQL volumes
 * - Transparent Data Encryption (TDE) handles encryption/decryption automatically
 *
 * In-transit encryption is enforced by requiring SSL/TLS on all database connections.
 */

import { env } from '@/config/env';

/**
 * Validate that the DATABASE_URL uses SSL/TLS for in-transit encryption.
 * Returns true if the connection string includes sslmode=require or similar.
 * Throws if TLS is not configured in production.
 */
export function enforceTLS(): boolean {
  const dbUrl = env.DATABASE_URL;
  const hasSsl =
    dbUrl.includes('sslmode=require') ||
    dbUrl.includes('sslmode=verify-full') ||
    dbUrl.includes('sslmode=verify-ca') ||
    dbUrl.includes('ssl=true');

  if (!hasSsl && env.NODE_ENV === 'production') {
    throw new Error(
      'DATABASE_URL must use SSL/TLS in production. Add ?sslmode=require to your connection string.',
    );
  }

  return hasSsl;
}

/**
 * List all tables that contain user data and must be cleaned on account deletion.
 * Used by the account deletion flow to ensure complete data removal.
 */
export function sanitizeForDeletion(userId: string): {
  userId: string;
  tables: string[];
} {
  return {
    userId,
    tables: [
      'users',                    // cascades to visibility_settings via FK
      'student_profiles',
      'mentor_profiles',
      'mentorship_connections',
      'mentor_ratings',
      'posts',
      'archive_entries',
      'check_in_questionnaires',
      'check_in_responses',
      'belonging_scores',
      'gap_reports',
      'onboarding_sessions',
      'coach_sessions',
      'ai_conversations',
    ],
  };
}
