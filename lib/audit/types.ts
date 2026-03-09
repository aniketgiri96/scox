export type AuditDimension = {
  name: string;
  score: number;
  summary: string;
  issues: string[];
  wins: string[];
  actions: string[];
};

export type GeoScore = {
  overall: number;
  chatgpt: number;
  perplexity: number;
  aiOverviews: number;
  reasons: string[];
};

export type CompetitorGap = {
  competitor: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
};

export type CompetitorAnalysis = {
  summary: string;
  gaps: CompetitorGap[];
  battlePlan: string[];
};

export type RoadmapWindow = {
  focus: string;
  actions: string[];
};

export type AuditRoadmap = {
  week1: RoadmapWindow;
  month1: RoadmapWindow;
  quarter1: RoadmapWindow;
};

export type AuditResult = {
  score: number;
  grade: string;
  quickWin: string;
  executiveSummary: string;
  dimensions: AuditDimension[];
  geoScore: GeoScore;
  roadmap: AuditRoadmap;
  competitorData?: CompetitorAnalysis;
  confidenceNotes: string[];
};

export type ResearchResult = {
  macroTrends: string[];
  serpSignals: string[];
  geoSignals: string[];
  opportunities: string[];
  risks: string[];
};

export type FrameworkStrategy = {
  positioning: string;
  audienceModel: string[];
  pillarPlan: string[];
  contentCadence: string;
  authorityPlan: string[];
  geoPlan: string[];
  kpis: string[];
};

export type IndustryPattern = {
  archetype: string;
  total_audits: number;
  avg_score: number;
  common_issues: Record<string, number>;
  top_insights: string[];
  schema_types: string[];
  updated_at: string;
};

export type CrawlResult = {
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  bodyText: string;
  wordCount: number;
  hasSchema: boolean;
  schemaTypes: string[];
  internalLinks: number;
  externalLinks: number;
  images: number;
  imagesWithAlt: number;
  hasCanonical: boolean;
  metaRobots: string;
};
