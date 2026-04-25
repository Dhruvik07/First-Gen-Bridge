export interface ResourceCard {
  id: string;
  institutionId: string;
  title: string;
  plainLanguageDescription: string;
  intendedAudience: string;
  accessSteps: string[];
  whatToExpect: string;
  reviews: ResourceReview[];
  availableLanguages: string[];
  tags: ResourceTag[];
}

export type ResourceTag =
  | 'visa_relevant'
  | 'childcare'
  | 'flexible_scheduling'
  | 'evening_accessible'
  | 'asynchronous'
  | 'accommodation_pathway'
  | 'disability_specific'
  | 'crisis';

export interface ResourceReview {
  id: string;
  studentId: string;
  content: string;
  approved: boolean;
  createdAt: Date;
}

export interface GapReport {
  id: string;
  studentId: string;
  institutionId: string;
  category: string;
  description: string;
  createdAt: Date;
}

export interface GapAggregate {
  category: string;
  institutionId: string;
  count: number;
  reports: GapReport[];
  surfacedToInstitution: boolean;
}
