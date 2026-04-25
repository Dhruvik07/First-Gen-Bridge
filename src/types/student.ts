export type Challenge =
  | 'financial_hardship'
  | 'cultural_adjustment'
  | 'academic_preparedness'
  | 'family_expectations'
  | 'language_barrier'
  | 'imposter_syndrome';

export interface StudentProfile {
  userId: string;
  major: string;
  personalizationProfile: PersonalizationProfile;
  onboardingComplete: boolean;
  belongingScore: number | null;
  lastCheckIn: Date | null;
}

export interface PersonalizationProfile {
  internationalStudent: boolean;
  parentingStatus: boolean;
  workSchedule: 'none' | 'part_time' | 'full_time';
  disabilityStatus: boolean;
  languagePreference: string;
  challenges: Challenge[];
  culturalBackground: string[];
}
