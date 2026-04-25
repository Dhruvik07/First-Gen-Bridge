import type { RankedMatch } from './mentor';
import type { Channel } from './community';
import type { ResourceCard } from './resource';

export interface OnboardingSession {
  id: string;
  userId: string;
  currentStep: number;
  totalSteps: number;
  stepData: Map<number, OnboardingStepData>;
  completed: boolean;
  lastSavedAt: Date;
}

export interface OnboardingStepData {
  stepNumber: number;
  field: string;
  value: unknown;
}

export interface OnboardingResult {
  recommendedMentors: RankedMatch[];
  recommendedChannels: Channel[];
  personalizedResources: ResourceCard[];
  disabilityResources?: ResourceCard[];
}
