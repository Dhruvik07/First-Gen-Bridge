import { invokeModel } from '@/lib/bedrock';
import type {
  AIMode,
  AIMessage,
  AIResponse,
  ModerationResult,
  RAGResult,
  CrisisDetection,
} from '@/types/ai';
import { detectCrisis } from '@/services/crisis-detection';

// ── System prompts per mode ──

const SYSTEM_PROMPTS: Record<AIMode, string> = {
  communication_coach:
    'You are a communication coach. Guide the student through writing their message step by step. Never write the message for them. Always ask what they want to say and build from their own words.',
  academic_navigation:
    'You are an academic guide. When a student asks a question, respond with scaffolding questions that help them find the answer themselves. Never give direct answers.',
  emotional_processing:
    'You are a supportive guide. When a student shares difficult feelings, respond with evidence-based cognitive scaffolding questions. Never make therapeutic claims. If you detect crisis language, respond with crisis resources.',
  unspoken_rules:
    'You answer questions about college norms warmly and without judgment. Normalize the question and give actionable guidance.',
};

/**
 * Build the full system prompt, optionally including a language directive.
 */
function buildSystemPrompt(mode: AIMode, language?: string): string {
  let prompt = SYSTEM_PROMPTS[mode];
  if (language && language !== 'en') {
    prompt += ` Respond in ${language}.`;
  }
  return prompt;
}

/**
 * Send a message through the AI Router to Bedrock.
 * Enforces guardrails and applies mode-specific system prompts.
 */
export async function sendMessage(
  conversationId: string,
  message: AIMessage,
  mode: AIMode,
  language?: string,
): Promise<AIResponse> {
  const systemPrompt = buildSystemPrompt(mode, language);

  const responseText = await invokeModel(message.content, systemPrompt);

  // Run crisis detection on the student's message
  const crisis: CrisisDetection = await detectCrisis(message.content);

  const guideMessage: AIMessage = {
    role: 'guide',
    content: responseText,
    timestamp: new Date(),
  };

  return {
    message: guideMessage,
    crisisDetection: crisis.detected ? crisis : undefined,
  };
}

/**
 * Moderate content using Bedrock. Returns whether the content is flagged.
 */
export async function moderateContent(content: string): Promise<ModerationResult> {
  const systemPrompt =
    'You are a content moderator. Analyze the following content for harmful, abusive, or inappropriate material. ' +
    'Respond with a JSON object: { "flagged": boolean, "reason": string | null, "confidence": number (0-1) }. ' +
    'Only output the JSON, nothing else.';

  try {
    const responseText = await invokeModel(content, systemPrompt);
    const parsed = JSON.parse(responseText);
    return {
      flagged: Boolean(parsed.flagged),
      reason: parsed.reason ?? null,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
    };
  } catch {
    // If parsing fails, default to not flagged
    return { flagged: false, reason: null, confidence: 0 };
  }
}

/**
 * Placeholder for Bedrock Knowledge Base RAG resource matching.
 * TODO: Connect to institution-specific Bedrock Knowledge Bases for RAG retrieval.
 * Will route queries through AI Router → Guardrails → Knowledge Base → Foundation Model.
 */
export async function matchResources(
  _query: string,
  _institutionKBId: string,
): Promise<RAGResult[]> {
  // TODO: Implement Bedrock Knowledge Base integration
  return [];
}
