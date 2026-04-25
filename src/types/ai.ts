export type AIMode = 'communication_coach' | 'academic_navigation' | 'emotional_processing' | 'unspoken_rules';

export type CommunicationScenario = 'email_professor' | 'request_accommodation' | 'apply_research' | 'negotiate_deadline';

export interface AIConversation {
  id: string;
  studentId: string;
  mode: AIMode;
  messages: AIMessage[];
  language: string;
  voiceMode: boolean;
  createdAt: Date;
}

export interface AIMessage {
  role: 'student' | 'guide';
  content: string;
  timestamp: Date;
  voiceTranscript?: string;
}

export interface AIResponse {
  message: AIMessage;
  crisisDetection?: CrisisDetection;
}

export interface CoachSession {
  id: string;
  conversationId: string;
  scenario: CommunicationScenario;
  currentStep: number;
  stepInputs: Map<number, string>;
  consolidatedDraft: string | null;
  completed: boolean;
}

export interface CrisisDetection {
  detected: boolean;
  crisisResource: CrisisResource | null;
  acknowledged: boolean;
}

export interface CrisisResource {
  institutionId: string;
  name: string;
  phone: string;
  description: string;
  available24h: boolean;
}

export interface VoiceConfig {
  language: string;
  sampleRate: number;
  encoding: string;
}

export interface Draft {
  content: string;
  scenario: CommunicationScenario;
  stepInputs: Map<number, string>;
  createdAt: Date;
}

export interface DraftEdit {
  content: string;
  editedAt: Date;
}

export interface CoachStepResponse {
  stepNumber: number;
  prompt: string;
  studentInput: string | null;
  completed: boolean;
}

export interface RAGResult {
  resourceId: string;
  content: string;
  relevanceScore: number;
  source: string;
}

export interface ModerationResult {
  flagged: boolean;
  reason: string | null;
  confidence: number;
}
