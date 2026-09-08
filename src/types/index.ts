export type UserRole = 'leadership' | 'faculty' | 'student' | 'consultant';

export type AcademicGovernanceType = 'faculty_senate' | 'scientific_council' | 'academic_council' | 'none';

export interface GovernanceSignoff {
  signoffType: 'academic' | 'administrative';
  bodyName: string; // e.g. "University Faculty Senate", "Scientific Council", "Office of the Provost"
  signedBy: string | null;
  signedAt: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'conditional';
  resolutionNotes: string;
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  missionStatement: string;
  governanceType: 'public' | 'private' | 'hybrid';
  academicGovernanceType: AcademicGovernanceType;
  academicGovernanceBodyName: string;
  provostOfficeName: string;
  accreditors: string[];
  legalJurisdiction: string;
  budgetTier: 'Small (<$50M)' | 'Medium ($50M-$250M)' | 'Large ($250M-$1B)' | 'Tier 1 R1 ($1B+)';
  enrollmentSize: number;
  studentDemographics: {
    undergraduatePercent: number;
    graduatePercent: number;
    internationalPercent: number;
    firstGenPercent: number;
    pellEligiblePercent: number;
  };
  currentAiPolicyStatus: 'none' | 'drafting' | 'formal';
  primaryLanguages: string[];
  activeOverlayPackId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OverlayPack {
  id: string;
  name: string;
  region: string;
  accreditationFrameworks: string[];
  dataProtectionRegime: 'FERPA' | 'GDPR' | 'MENA_PDPL' | 'MIXED';
  languagesSupported: string[];
  regionalCaseStudyFocus: string;
  specialComplianceGates: string[];
  description: string;
}

export type ConfidenceTier = 'peer_reviewed' | 'vendor_reported' | 'journalistic' | 'anecdotal' | 'unverified';
export type RetractionStatus = 'active' | 'retracted' | 'disputed';

export interface EvidenceClaim {
  id: string;
  tenantId: string;
  claimText: string;
  sourceUrl: string; // Mandatory in backend & UI!
  sourceName: string;
  confidenceTier: ConfidenceTier;
  datePublished: string;
  dateAdded: string;
  retractionStatus: RetractionStatus;
  tags: string[];
  discipline?: string;
  program?: string;
}

export interface EvidenceStagingItem {
  id: string;
  tenantId: string;
  claimText: string;
  sourceUrl: string;
  sourceName: string;
  confidenceTier: ConfidenceTier;
  datePublished: string;
  discoveredAt: string;
  status: 'pending_review' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type HumanDisposition = 'pending' | 'accepted' | 'rejected' | 'modified' | null;

export interface DecisionRecord {
  id: string;
  tenantId: string;
  title: string;
  summary: string;
  domain: 'pedagogy' | 'grading_assessment' | 'enrollment_admissions' | 'workforce' | 'research' | 'governance' | 'infrastructure';
  touchesEnrollmentOrGrading: boolean; // Hardcoded gate requirement!
  humanApprovalGatePassed: boolean; // Non-negotiable human approval
  humanDisposition: HumanDisposition; // REQUIRED non-null before implementation
  dispositionNotes?: string;
  dispositionSetBy?: string;
  dispositionSetAt?: string;
  implementationStatus: 'proposed' | 'under_review' | 'approved_pending' | 'implemented' | 'shelved';
  isAiDrafted: boolean; // Labels AI assistance
  kernelSectionIds: string[]; // Links to Compass principles
  // Multi-Signature Academic + Administrative Dual Governance Gate (Sections II, XIV & XXX)
  academicSignoff?: GovernanceSignoff;
  administrativeSignoff?: GovernanceSignoff;
  auditDossierGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditDossierData {
  dossierId: string;
  generatedAt: string;
  institution: Institution;
  decision: DecisionRecord;
  finalTestResults: FinalTestAuditEntry[];
  evidenceArchitecture: {
    claimedAssumptions: string[];
    verifiedEvidence: string[];
    counterEvidence: string[];
    epistemicStatus: string;
  };
  governanceCertification: {
    academicBody: GovernanceSignoff;
    administrativeBody: GovernanceSignoff;
    quorumSatisfied: boolean;
    finalDisposition: HumanDisposition;
  };
}

export type ScenarioType = 'conservative' | 'moderate' | 'ambitious' | 'adverse' | 'disruptive';

export interface ScenarioEntry {
  id: string;
  decisionId: string;
  scenarioType: ScenarioType;
  title: string;
  description: string;
  keyAssumptions: string[];
  nonTechDrivers: {
    demographics: string;
    economics: string;
    policy: string;
    geopolitics: string;
  };
  reversibilityRating: number; // 1 (highly irreversible) to 5 (completely reversible)
  isAiDrafted: boolean;
}

export interface StakeholderImpact {
  id: string;
  decisionId: string;
  stakeholderGroup:
    | 'Students (Low Income / Pell)'
    | 'First-Gen Students'
    | 'Students with Disabilities'
    | 'International Students'
    | 'Adjunct / Contingent Faculty'
    | 'Tenure-Track Faculty'
    | 'Professional / Support Staff'
    | 'Local Community';
  benefitDescription: string;
  costDescription: string;
  powerShift: 'gains' | 'loses' | 'neutral';
}

export interface PredictionRecord {
  id: string;
  tenantId: string;
  predictionText: string;
  madeByUserId: string;
  madeByUserName: string;
  madeByRole: UserRole;
  dateMade: string;
  targetDate: string;
  actualOutcome?: string;
  resolutionStatus: 'pending' | 'correct' | 'incorrect' | 'partially_correct';
  lessonsLearned?: string;
  scopeLevel: 'institution' | 'program' | 'course';
}

export type RedFlagCategory =
  | 'accreditation_gap'
  | 'integrity_collapse'
  | 'rollback_after_launch'
  | 'vendor_lock_in'
  | 'mental_health_harm'
  | 'overreliance'
  | 'financial_exposure';

export interface RedFlagCase {
  id: string;
  title: string;
  category: RedFlagCategory;
  institutionOrContext: string;
  caseSummary: string; // Paraphrased, non-quoted summary
  sourceUrl: string;
  patternDescription: string;
  warningSigns: string[];
  mitigations: string[];
  dateReported: string;
}

export interface RedFlagStagingItem {
  id: string;
  title: string;
  category: RedFlagCategory;
  caseSummary: string;
  sourceUrl: string;
  warningSigns: string[];
  mitigations: string[];
  discoveredAt: string;
  status: 'pending_review' | 'approved' | 'rejected';
}

export interface PulseSurveyResponse {
  id: string;
  tenantId: string;
  role: 'faculty' | 'student';
  disciplineOrProgram: string;
  aiUsageFrequency: 'daily' | 'weekly' | 'occasional' | 'never';
  primaryToolsUsed: string[];
  perceivedAcademicValue: number; // 1-5
  perceivedIntegrityRisk: number; // 1-5
  comments: string;
  createdAt: string;
}

export interface ShadowAiReport {
  id: string;
  tenantId: string;
  reportedByRole: UserRole;
  departmentOrCourse: string;
  toolOrUseName: string;
  description: string;
  perceivedRiskType: 'unapproved_grading' | 'student_data_leak' | 'misinformation' | 'accreditation_bypass' | 'shadow_vendor';
  status: 'flagged' | 'under_review' | 'mitigated';
  actionTaken?: string;
  createdAt: string;
}

export interface JobExecutionStatus {
  jobId: 'evidence_refresh' | 'prediction_reconciliation' | 'red_flag_scan';
  jobName: string;
  autonomyLevel: 'semi_automated' | 'fully_automated';
  lastRunAt: string;
  nextRunDueAt: string;
  itemsProcessed: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastResultSummary: string;
}

export interface KernelVersionInfo {
  version: string;
  name: string;
  releaseDate: string;
  changelogRationale: string;
  sectionsCount: number;
  finalTestCount: number;
}

// Master Compass Types & Extensions
export type EpistemicDistinction = 'evidence' | 'interpretation' | 'inference' | 'prediction' | 'recommendation' | 'speculation';

export type AutonomyClassification = 'automation' | 'augmentation' | 'delegation' | 'collaboration' | 'human_only';

export type PossibilitySpace =
  | 'possible_now'
  | 'modest_changes'
  | 'substantial_changes'
  | 'external_regulatory_change'
  | 'currently_impossible';

export type DivergenceTier =
  | 'legally_required'
  | 'accreditation_required'
  | 'institutional_policy'
  | 'conventional_practice'
  | 'educationally_desirable'
  | 'ethically_desirable'
  | 'future_desirable';

export interface EvidenceArchitecture {
  evidence: string;
  counterevidence: string;
  uncertainty: string;
  assumptions: string[];
  transferability: string;
  risks: string[];
  opportunityCosts: string;
  reversibility: string;
  indicators: string[];
}

export interface AlternativePathways {
  optionA_minimal: string;
  optionB_moderate: string;
  optionC_structural: string;
  optionD_experimental: string;
}

export interface FinalTestAuditEntry {
  id: string;
  title: string;
  question: string;
  status: 'passed' | 'warning_surfaced' | 'failed_deliberation_required';
  tradeoffNotes: string;
}

export interface FinalTestAuditResult {
  id: string;
  proposalTitle: string;
  decisionId?: string;
  evaluatedAt: string;
  evaluatedByRole: UserRole;
  overallDisposition: 'approved_with_safeguards' | 'deliberation_mandated' | 'critical_tradeoffs_surfaced';
  tests: FinalTestAuditEntry[];
  deliberationNotice: string;
}

export interface InstitutionalDiagnosticItem {
  id: string;
  name: string;
  category: 'academic' | 'students' | 'faculty' | 'research' | 'governance_finance' | 'legal_accreditation';
  isAvailable: boolean;
  notes?: string;
  dataReference?: string;
}

export interface CompassSection {
  id: string;
  title: string;
  summary: string;
  theme: 'epistemic_agency' | 'common_good_governance' | 'academic_pluralism' | 'whole_ecosystem' | 'safety_procurement';
  keyDirectives: string[];
  diagnosticQuestions?: string[];
  subItems?: string[];
  governingQuotes?: string[];
}
