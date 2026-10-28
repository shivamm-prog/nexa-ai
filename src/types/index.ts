export type SourceType = 
  | 'Research Paper'
  | 'Government Report'
  | 'Academic Article'
  | 'Industry Report'
  | 'News Article';

export type StanceType = 'Supports' | 'Critical' | 'Mixed' | 'Neutral';

export type ClaimStatus = 'Supported' | 'Mixed' | 'Disputed';

export interface Source {
  id: string;
  title: string;
  type: SourceType;
  year: number;
  authors: string;
  publisher: string;
  relevance: number; // 0 - 100 percentage
  stance: StanceType;
  summary: string;
  keyQuote: string;
  evidenceSnippet: string;
  methodology?: string;
  sampleSize?: string;
  doi?: string;
  url?: string;
  claimIds: string[];
  insightsUsedCount: number;
}

export interface Claim {
  id: string;
  text: string;
  category: string;
  status: ClaimStatus;
  supportingSourceIds: string[];
  opposingSourceIds: string[];
  evidenceSummary: string;
  explanation: string;
  keyQuotes: {
    sourceId: string;
    quote: string;
    stance: StanceType;
  }[];
  whyAmISeeingThis: string;
}

export interface Agreement {
  id: string;
  title: string;
  statement: string;
  confidence: 'High Evidence' | 'Moderate Evidence' | 'Emerging Consensus';
  supportingSourceIds: string[];
  extractedEvidence: string[];
  relatedClaimIds: string[];
  sourceTypeBreakdown: Record<string, number>;
  whyAmISeeingThis: string;
}

export interface DisagreementSide {
  sourceId: string;
  sourceTitle: string;
  sourceType: SourceType;
  stance: string; // e.g., "Supports" or "Raises Concern"
  claimSnippet: string;
  contextCondition: string;
  studyPopulation: string;
}

export interface Disagreement {
  id: string;
  question: string;
  category: string;
  sourceA: DisagreementSide;
  sourceB: DisagreementSide;
  whyDifferentFactors: {
    factor: string;
    sourceAContext: string;
    sourceBContext: string;
    analysis: string;
  }[];
  systemConclusionNote: string;
  whyAmISeeingThis: string;
}

export interface ExploreNextItem {
  id: string;
  title: string;
  underexploredArea: string;
  whyThisSurfaced: string;
  supportingContext: {
    relatedClaims: string[];
    relevantSources: string[];
    relatedTopics: string[];
  };
  candidateLabel: string;
  methodologyGap: string;
  suggestedResearchDirections: string[];
  whyAmISeeingThis: string;
}

export interface InvestigationData {
  id: string;
  topic: string;
  summary: string;
  overviewStats: {
    sourcesCount: number;
    claimsCount: number;
    agreementsCount: number;
    disagreementsCount: number;
    exploreNextCount: number;
  };
  sources: Source[];
  claims: Claim[];
  agreements: Agreement[];
  disagreements: Disagreement[];
  exploreNext: ExploreNextItem;
  lastAnalyzed: string;
  status: 'Completed' | 'Analyzing' | 'Draft';
}

export interface SavedItem {
  id: string;
  type: 'investigation' | 'insight' | 'disagreement' | 'explore_next' | 'source';
  title: string;
  preview: string;
  topic: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
  rawItem?: any;
}

export interface UserSettings {
  theme: 'dark-navy' | 'midnight-slate' | 'deep-noir';
  preferredSources: SourceType[];
  displayDensity: 'comfortable' | 'compact';
  showFlowAnimations: boolean;
  confidenceThreshold: number;
  strictnessMode: 'Exploratory' | 'Standard' | 'Rigorous Peer-Reviewed';
  researcherProfile: 'Undergraduate' | 'Postgraduate' | 'Independent Researcher' | 'Faculty';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
