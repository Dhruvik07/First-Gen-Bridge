import type { Challenge } from './student';

export interface MentorProfile {
  userId: string;
  verified: boolean;
  firstGenNarrative: string;
  challengesOvercome: Challenge[];
  topicsAvailable: string[];
  languagesSpoken: string[];
  educationalBackground: string;
  expectedResponseTime: string;
  institutionId: string;
  averageRating: number;
  trainingCompleted: boolean;
}

export interface MentorRegistrationData {
  firstGenStatus: boolean;
  educationalBackground: string;
  languagesSpoken: string[];
  areasOfExperience: string[];
  personalNarrative: string;
}

export interface MentorRating {
  mentorId: string;
  studentId: string;
  score: number;
  feedback: string;
}

export interface MentorCandidate {
  id: string;
  userId: string;
  registrationData: MentorRegistrationData;
  trainingCompleted: boolean;
  verified: boolean;
  submittedAt: Date;
}

export interface RankedMatch {
  mentor: MentorProfile;
  score: CompatibilityScore;
  rank: number;
}

export interface CompatibilityScore {
  total: number;
  breakdown: {
    majorAlignment: number;
    sharedChallenges: number;
    culturalBackground: number;
    languagePreference: number;
    institutionFamiliarity: number;
    personalizationOverlap: number;
  };
}

export interface CompatibilityWeights {
  majorAlignment: number;
  sharedChallenges: number;
  culturalBackground: number;
  languagePreference: number;
  institutionFamiliarity: number;
  personalizationOverlap: number;
}

export interface MentorVerificationResult {
  verified: boolean;
  mentorId: string;
  failedSections?: string[];
  message: string;
}

export interface TrainingResults {
  passed: boolean;
  score: number;
  failedSections: string[];
  completedAt: Date;
}
