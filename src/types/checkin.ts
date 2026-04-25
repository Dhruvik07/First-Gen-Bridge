export interface CheckInQuestionnaire {
  id: string;
  studentId: string;
  weekOf: Date;
  questions: CheckInQuestion[];
}

export interface CheckInQuestion {
  id: string;
  text: string;
  responseType: 'scale_1_5' | 'yes_no' | 'free_text';
}

export interface CheckInResponses {
  questionnaireId: string;
  answers: Map<string, number | boolean | string>;
}

export interface BelongingScore {
  value: number;
  belowThreshold: boolean;
  computedAt: Date;
}

export interface SupportRecommendation {
  type: 'mentor_session' | 'community_channel' | 'resource';
  title: string;
  description: string;
  actionUrl: string;
}
