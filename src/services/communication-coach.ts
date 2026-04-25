import { query } from '@/lib/db';
import { sendMessage } from '@/services/ai-router';
import type {
  CoachSession,
  CommunicationScenario,
  CoachStepResponse,
  Draft,
  DraftEdit,
  AIMessage,
} from '@/types/ai';
import { randomUUID } from 'crypto';

// ── Row types ──

interface ConversationRow {
  id: string;
  student_id: string;
  mode: string;
  language: string;
  voice_mode: boolean;
  created_at: Date;
}

interface CoachSessionRow {
  id: string;
  conversation_id: string;
  scenario: string;
  current_step: number;
  consolidated_draft: string | null;
  completed: boolean;
}

interface StepInputRow {
  session_id: string;
  step_number: number;
  input: string;
}

// ── Helpers ──

function toCoachSession(row: CoachSessionRow, stepInputs: Map<number, string>): CoachSession {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    scenario: row.scenario as CommunicationScenario,
    currentStep: row.current_step,
    stepInputs,
    consolidatedDraft: row.consolidated_draft,
    completed: row.completed,
  };
}

async function getStepInputs(sessionId: string): Promise<Map<number, string>> {
  const rows = await query<StepInputRow>(
    `SELECT session_id, step_number, input FROM coach_step_inputs WHERE session_id = $1 ORDER BY step_number`,
    [sessionId],
  );
  const map = new Map<number, string>();
  for (const row of rows) {
    map.set(row.step_number, row.input);
  }
  return map;
}

// ── Service functions ──

/**
 * Start a new Communication Coach session.
 * Creates an ai_conversation and a coach_session in the database.
 */
export async function startSession(
  studentId: string,
  scenario: CommunicationScenario,
): Promise<CoachSession> {
  const conversationId = randomUUID();
  const sessionId = randomUUID();

  await query<ConversationRow>(
    `INSERT INTO ai_conversations (id, student_id, mode, language, voice_mode)
     VALUES ($1, $2, 'communication_coach', 'en', false)
     RETURNING *`,
    [conversationId, studentId],
  );

  const sessionRows = await query<CoachSessionRow>(
    `INSERT INTO coach_sessions (id, conversation_id, scenario, current_step, completed)
     VALUES ($1, $2, $3, 1, false)
     RETURNING *`,
    [sessionId, conversationId, scenario],
  );

  return toCoachSession(sessionRows[0], new Map());
}

/**
 * Submit student input for a specific step.
 * Stores the input, advances the step, and uses the AI Router to generate the next prompt.
 */
export async function submitStepInput(
  sessionId: string,
  stepNumber: number,
  input: string,
): Promise<CoachStepResponse> {
  // Store the step input
  await query(
    `INSERT INTO coach_step_inputs (session_id, step_number, input)
     VALUES ($1, $2, $3)
     ON CONFLICT (session_id, step_number) DO UPDATE SET input = $3`,
    [sessionId, stepNumber, input],
  );

  // Get session to find conversation ID
  const sessionRows = await query<CoachSessionRow>(
    `SELECT * FROM coach_sessions WHERE id = $1`,
    [sessionId],
  );
  if (sessionRows.length === 0) throw new Error('Session not found');
  const session = sessionRows[0];

  // Advance step
  const nextStep = Math.min(stepNumber + 1, 5);
  const completed = stepNumber >= 5;

  await query(
    `UPDATE coach_sessions SET current_step = $1, completed = $2 WHERE id = $3`,
    [nextStep, completed, sessionId],
  );

  // Generate next prompt via AI Router
  const studentMessage: AIMessage = {
    role: 'student',
    content: `[Step ${stepNumber} input for ${session.scenario}]: ${input}`,
    timestamp: new Date(),
  };

  const aiResponse = await sendMessage(
    session.conversation_id,
    studentMessage,
    'communication_coach',
  );

  return {
    stepNumber: nextStep,
    prompt: aiResponse.message.content,
    studentInput: input,
    completed,
  };
}

/**
 * Get the consolidated draft by combining all step inputs.
 */
export async function getConsolidatedDraft(sessionId: string): Promise<Draft> {
  const sessionRows = await query<CoachSessionRow>(
    `SELECT * FROM coach_sessions WHERE id = $1`,
    [sessionId],
  );
  if (sessionRows.length === 0) throw new Error('Session not found');
  const session = sessionRows[0];

  const stepInputs = await getStepInputs(sessionId);

  // If a consolidated draft already exists, return it
  if (session.consolidated_draft) {
    return {
      content: session.consolidated_draft,
      scenario: session.scenario as CommunicationScenario,
      stepInputs,
      createdAt: new Date(),
    };
  }

  // Build draft from step inputs
  const parts: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const input = stepInputs.get(i);
    if (input) parts.push(input);
  }
  const content = parts.join('\n\n');

  // Save consolidated draft
  await query(
    `UPDATE coach_sessions SET consolidated_draft = $1 WHERE id = $2`,
    [content, sessionId],
  );

  return {
    content,
    scenario: session.scenario as CommunicationScenario,
    stepInputs,
    createdAt: new Date(),
  };
}

/**
 * Edit the consolidated draft.
 */
export async function editDraft(sessionId: string, edits: DraftEdit): Promise<Draft> {
  await query(
    `UPDATE coach_sessions SET consolidated_draft = $1 WHERE id = $2`,
    [edits.content, sessionId],
  );

  const stepInputs = await getStepInputs(sessionId);
  const sessionRows = await query<CoachSessionRow>(
    `SELECT * FROM coach_sessions WHERE id = $1`,
    [sessionId],
  );

  return {
    content: edits.content,
    scenario: sessionRows[0].scenario as CommunicationScenario,
    stepInputs,
    createdAt: edits.editedAt,
  };
}
