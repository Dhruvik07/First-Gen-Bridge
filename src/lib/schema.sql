-- FirstBridge Platform Database Schema
-- PostgreSQL

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('student', 'mentor', 'peer_moderator', 'admin');
CREATE TYPE work_schedule AS ENUM ('none', 'part_time', 'full_time');
CREATE TYPE mentorship_status AS ENUM ('pending', 'active', 'paused', 'ended');
CREATE TYPE channel_category AS ENUM ('major', 'identity', 'challenge', 'win_board');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'flagged', 'removed');
CREATE TYPE moderation_action AS ENUM ('approve', 'remove', 'escalate');
CREATE TYPE check_in_response_type AS ENUM ('scale_1_5', 'yes_no', 'free_text');
CREATE TYPE archive_entry_type AS ENUM ('communication_draft', 'mentor_session', 'community_contribution', 'custom');
CREATE TYPE ai_mode AS ENUM ('communication_coach', 'academic_navigation', 'emotional_processing', 'unspoken_rules');
CREATE TYPE communication_scenario AS ENUM ('email_professor', 'request_accommodation', 'apply_research', 'negotiate_deadline');

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE visibility_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  profile_public BOOLEAN NOT NULL DEFAULT false,
  show_major BOOLEAN NOT NULL DEFAULT true,
  show_challenges BOOLEAN NOT NULL DEFAULT false,
  show_identity BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE student_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  major TEXT NOT NULL DEFAULT '',
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  belonging_score INT,
  last_check_in TIMESTAMPTZ,
  personalization JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE mentor_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  verified BOOLEAN NOT NULL DEFAULT false,
  first_gen_narrative TEXT NOT NULL DEFAULT '',
  challenges_overcome TEXT[] NOT NULL DEFAULT '{}',
  topics_available TEXT[] NOT NULL DEFAULT '{}',
  languages_spoken TEXT[] NOT NULL DEFAULT '{}',
  educational_background TEXT NOT NULL DEFAULT '',
  expected_response_time TEXT NOT NULL DEFAULT '24 hours',
  average_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  training_completed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE mentor_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  feedback TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE mentorship_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status mentorship_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  plain_language_description TEXT NOT NULL,
  intended_audience TEXT NOT NULL DEFAULT '',
  access_steps TEXT[] NOT NULL DEFAULT '{}',
  what_to_expect TEXT NOT NULL DEFAULT '',
  available_languages TEXT[] NOT NULL DEFAULT '{en}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE resource_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gap_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE systemic_gap_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category channel_category NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  anonymous BOOLEAN NOT NULL DEFAULT false,
  content TEXT NOT NULL,
  moderation_status moderation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE flagged_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  ai_confidence FLOAT NOT NULL DEFAULT 0,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  action moderation_action,
  flagged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE check_in_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_of DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE check_in_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES check_in_questionnaires(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  response_type check_in_response_type NOT NULL
);

CREATE TABLE check_in_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES check_in_questionnaires(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES check_in_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_number INT,
  answer_boolean BOOLEAN
);

CREATE TABLE belonging_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  value INT NOT NULL,
  below_threshold BOOLEAN NOT NULL DEFAULT false,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE archive_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type archive_entry_type NOT NULL,
  description TEXT NOT NULL,
  shared_to_win_board BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_step INT NOT NULL DEFAULT 1,
  total_steps INT NOT NULL DEFAULT 9,
  step_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coach_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  scenario communication_scenario NOT NULL,
  current_step INT NOT NULL DEFAULT 1,
  step_inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  consolidated_draft TEXT,
  completed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode ai_mode NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  language TEXT NOT NULL DEFAULT 'en',
  voice_mode BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crisis_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  available_24h BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Institution lookups
CREATE INDEX idx_users_institution_id ON users(institution_id);
CREATE INDEX idx_resources_institution_id ON resources(institution_id);
CREATE INDEX idx_crisis_resources_institution_id ON crisis_resources(institution_id);

-- Mentor availability (verified mentors at an institution)
CREATE INDEX idx_mentor_profiles_verified ON mentor_profiles(verified) WHERE verified = true;

-- Gap report aggregation by category and institution
CREATE INDEX idx_gap_reports_category_institution ON gap_reports(category, institution_id);
CREATE INDEX idx_systemic_gap_reports_institution ON systemic_gap_reports(institution_id);

-- Session token lookup
CREATE INDEX idx_sessions_token ON sessions(token);

-- Posts by channel
CREATE INDEX idx_posts_channel_id ON posts(channel_id);

-- Flagged content pending review
CREATE INDEX idx_flagged_content_pending ON flagged_content(action) WHERE action IS NULL;

-- Check-in by student
CREATE INDEX idx_check_in_questionnaires_student ON check_in_questionnaires(student_id);

-- Belonging scores by student
CREATE INDEX idx_belonging_scores_student ON belonging_scores(student_id);

-- AI conversations by student
CREATE INDEX idx_ai_conversations_student ON ai_conversations(student_id);

-- Coach sessions by conversation
CREATE INDEX idx_coach_sessions_conversation ON coach_sessions(conversation_id);

-- Archive entries by student
CREATE INDEX idx_archive_entries_student ON archive_entries(student_id);
