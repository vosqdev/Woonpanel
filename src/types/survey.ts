export type SurveyCategory = 'woonwensen' | 'woonscan' | 'woonopinie';
export type SurveyStatus = 'active' | 'upcoming' | 'completed';

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'slider'
  | 'rating'
  | 'ranking'
  | 'text'
  | 'scenario'
  | 'map';

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface ScenarioOption {
  id: string;
  title: string;
  description: string;
  highlight: string;
  housingUnits: string;
  greenSpace: string;
  parkingConcept: string;
  imageHint?: string;
}

export interface MapPinCategory {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export interface QuestionCondition {
  questionId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than';
  value: string | number | string[];
}

export interface Question {
  id: string;
  stepTitle: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  // For slider
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  labels?: { [key: number]: string };
  // For rating
  ratingMax?: number;
  ratingType?: 'stars' | 'numbers';
  ratingLabels?: { low: string; high: string };
  // For ranking
  rankingItems?: { id: string; label: string }[];
  // For scenario
  scenarios?: ScenarioOption[];
  // For map
  mapCenter?: [number, number];
  mapZoom?: number;
  mapAreaName?: string;
  pinCategories?: MapPinCategory[];
  // Conditional rendering
  condition?: QuestionCondition;
}

export interface Survey {
  id: string;
  title: string;
  slug: string;
  category: SurveyCategory;
  description: string;
  durationMinutes: number;
  targetAudience: string;
  location: {
    municipality: string;
    city: string;
    district?: string;
    neighborhood?: string;
    cbsCode?: string; // e.g. GM0344 or BU03440101
  };
  startDate: string;
  endDate: string;
  status: SurveyStatus;
  participantCount: number;
  isOfficialParticipation?: boolean;
  commissioner?: string; // e.g. "Gemeente Utrecht" / "Woningcorporatie Portaal"
  questions: Question[];
}

export interface SurveyAnswer {
  questionId: string;
  value: any;
  timestamp: string;
}

export interface SurveySubmission {
  id: string;
  surveyId: string;
  category: SurveyCategory;
  submittedAt: string;
  anonymousRespondentId: string;
  cbsBuurtCode?: string;
  answers: Record<string, any>;
  contactProvided?: boolean;
}

export interface WoonscanScoreCategory {
  category: string;
  score: number; // 0 - 100
  label: string;
  benchmarkScore: number;
  insight: string;
  tips: string[];
}

export interface WoonscanSummary {
  overallScore: number;
  categories: {
    comfort: WoonscanScoreCategory;
    betaalbaarheid: WoonscanScoreCategory;
    energie: WoonscanScoreCategory;
    leefomgeving: WoonscanScoreCategory;
    toekomstbestendigheid: WoonscanScoreCategory;
  };
  keyFindings: string[];
}

export type AdminRole = 'super_admin' | 'research_admin' | 'viewer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  organization: string;
}

export interface WoondataSyncStatus {
  lastSync: string | null;
  totalSyncedRecords: number;
  complianceVerified: boolean;
  dpaSigned: boolean;
  kAnonymityMet: boolean;
  apiKeyConfigured: boolean;
  targetEndpoint: string;
}
