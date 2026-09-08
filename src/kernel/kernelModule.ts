import compassV1 from './compass-v1.0.json';
import { KernelVersionInfo, CompassSection } from '../types';

export interface FinalTestRubric {
  id: string;
  title: string;
  question: string;
  directive?: string;
}

export interface CompassKernelData {
  version: string;
  name: string;
  releaseDate: string;
  purpose: string;
  governingQuestion: string;
  oneSentenceMission: string;
  operatingPrinciple: string;
  principles: CompassSection[];
  finalTestRubric: FinalTestRubric[];
}

const activeKernel: CompassKernelData = compassV1 as CompassKernelData;

const kernelVersionHistory: KernelVersionInfo[] = [
  {
    version: '1.0.0',
    name: 'Higher Education AI Compass Master Kernel v1.0',
    releaseDate: '2026-08-08',
    changelogRationale: 'Full master prompt integration comprising 30 foundational sections, 12 Final Tests, 5 scenario types, 32 institutional diagnostics, and explicit human flourishing operating principle.',
    sectionsCount: 30,
    finalTestCount: 12
  },
  {
    version: '0.9.0-draft',
    name: 'Draft Master Prompt Framework',
    releaseDate: '2026-06-15',
    changelogRationale: 'Early draft outline establishing the non-negotiable principle of human flourishing over technical substitution.',
    sectionsCount: 28,
    finalTestCount: 10
  }
];

// 32 Institutional Information Diagnostic Checklist (Section VI)
export const INSTITUTIONAL_DIAGNOSTIC_CATEGORIES = [
  { id: 'diag-1', name: 'Mission Statements', category: 'governance_finance' as const },
  { id: 'diag-2', name: 'Strategic Plans', category: 'governance_finance' as const },
  { id: 'diag-3', name: 'Academic Catalogs', category: 'academic' as const },
  { id: 'diag-4', name: 'Curricula & Learning Outcomes', category: 'academic' as const },
  { id: 'diag-5', name: 'Program Inventories', category: 'academic' as const },
  { id: 'diag-6', name: 'Enrollment Data & Trends', category: 'students' as const },
  { id: 'diag-7', name: 'Retention & Completion Data', category: 'students' as const },
  { id: 'diag-8', name: 'Faculty Profiles & Tenured Ratios', category: 'faculty' as const },
  { id: 'diag-9', name: 'Staffing Structures & Workloads', category: 'faculty' as const },
  { id: 'diag-10', name: 'Research Portfolios & Outputs', category: 'research' as const },
  { id: 'diag-11', name: 'Research Strategies & Priorities', category: 'research' as const },
  { id: 'diag-12', name: 'Budgets & Financial Constraints', category: 'governance_finance' as const },
  { id: 'diag-13', name: 'Facilities & Campus Footprint', category: 'governance_finance' as const },
  { id: 'diag-14', name: 'Infrastructure & Tech Systems', category: 'governance_finance' as const },
  { id: 'diag-15', name: 'Technology Architectures & LMS', category: 'governance_finance' as const },
  { id: 'diag-16', name: 'Governance Structures & Charters', category: 'governance_finance' as const },
  { id: 'diag-17', name: 'Faculty Governance Documents & Senate', category: 'faculty' as const },
  { id: 'diag-18', name: 'Student-Support Structures', category: 'students' as const },
  { id: 'diag-19', name: 'Advising Systems & Workflows', category: 'students' as const },
  { id: 'diag-20', name: 'Accreditation Requirements & Standards', category: 'legal_accreditation' as const },
  { id: 'diag-21', name: 'Institutional Policies & Handbooks', category: 'legal_accreditation' as const },
  { id: 'diag-22', name: 'AI Policies & Guidelines', category: 'legal_accreditation' as const },
  { id: 'diag-23', name: 'Collective Bargaining Agreements', category: 'faculty' as const },
  { id: 'diag-24', name: 'Assessment & Grading Practices', category: 'academic' as const },
  { id: 'diag-25', name: 'Admissions Practices & Criteria', category: 'students' as const },
  { id: 'diag-26', name: 'Student Demographic Breakdown', category: 'students' as const },
  { id: 'diag-27', name: 'Institutional Research Reports', category: 'research' as const },
  { id: 'diag-28', name: 'Board of Trustees / Regents Decisions', category: 'governance_finance' as const },
  { id: 'diag-29', name: 'Prior Strategic Initiatives & Audits', category: 'governance_finance' as const },
  { id: 'diag-30', name: 'Relevant White Papers & Taskforce Reports', category: 'academic' as const },
  { id: 'diag-31', name: 'Institutional Histories & Traditions', category: 'academic' as const },
  { id: 'diag-32', name: 'Community Relationships & Civic Compacts', category: 'governance_finance' as const }
];

export function getActiveKernel(): CompassKernelData {
  return activeKernel;
}

export function getPrincipleById(id: string): CompassSection | undefined {
  return activeKernel.principles.find(p => p.id === id);
}

export function getKernelVersionHistory(): KernelVersionInfo[] {
  return kernelVersionHistory;
}

export function evaluateProposalAgainstKernel(proposalText: string) {
  const lowercase = proposalText.toLowerCase();
  
  const relevantPrinciples = activeKernel.principles.filter(p => {
    if (lowercase.includes('grad') || lowercase.includes('assess') || lowercase.includes('eval') || lowercase.includes('test')) {
      if (['II', 'IV', 'XX', 'XXI', 'XXIII'].includes(p.id)) return true;
    }
    if (lowercase.includes('enroll') || lowercase.includes('admiss') || lowercase.includes('retention') || lowercase.includes('recruit')) {
      if (['II', 'XIX', 'XXVII', 'XXVIII'].includes(p.id)) return true;
    }
    if (lowercase.includes('vendor') || lowercase.includes('procure') || lowercase.includes('tool') || lowercase.includes('contract')) {
      if (['XXVI', 'XV', 'VIII'].includes(p.id)) return true;
    }
    if (lowercase.includes('faculty') || lowercase.includes('work') || lowercase.includes('job') || lowercase.includes('tenure')) {
      if (['XXV', 'XIV', 'XIX'].includes(p.id)) return true;
    }
    if (lowercase.includes('research') || lowercase.includes('paper') || lowercase.includes('publish') || lowercase.includes('data')) {
      if (['XXIV', 'XV', 'XIII'].includes(p.id)) return true;
    }
    if (lowercase.includes('program') || lowercase.includes('curriculum') || lowercase.includes('degree') || lowercase.includes('major')) {
      if (['XII', 'XIII', 'XXIII'].includes(p.id)) return true;
    }
    return ['I', 'II', 'III', 'XVI', 'XXX'].includes(p.id);
  });

  // Calculate simulated Final Test flags based on text
  const finalTestResults = activeKernel.finalTestRubric.map(test => {
    let status: 'passed' | 'warning_surfaced' | 'failed_deliberation_required' = 'passed';
    let tradeoffNotes = 'Conforms with foundational principles under supervised implementation.';

    if (test.id === 'human_agency' && (lowercase.includes('auto-grade') || lowercase.includes('automated admission') || lowercase.includes('autonomous grading'))) {
      status = 'failed_deliberation_required';
      tradeoffNotes = 'Section II & Section IV mandate: Autonomous grading or student classification directly diminishes human agency. Requires human instructor approval gate.';
    } else if (test.id === 'equity' && (lowercase.includes('proctor') || lowercase.includes('surveillance') || lowercase.includes('mandatory tool'))) {
      status = 'warning_surfaced';
      tradeoffNotes = 'Section XIX warning: Hardware or algorithmic surveillance tools disproportionately penalize low-income, disabled, or non-native speaking students.';
    } else if (test.id === 'autonomy' && (lowercase.includes('proprietary') || lowercase.includes('vendor') || lowercase.includes('exclusive lock-in'))) {
      status = 'warning_surfaced';
      tradeoffNotes = 'Section XXVI warning: Vendor dependency poses long-term lock-in risk. Contractual exit and data portability must be guaranteed.';
    } else if (test.id === 'reversibility' && (lowercase.includes('retire program') || lowercase.includes('eliminate department'))) {
      status = 'failed_deliberation_required';
      tradeoffNotes = 'Section XII & XVIII warning: Program retirement is difficult to reverse. Broad deliberative governance is mandatory before action.';
    }

    return {
      id: test.id,
      title: test.title,
      question: test.question,
      status,
      tradeoffNotes
    };
  });

  return {
    proposalText,
    matchedPrinciples: relevantPrinciples,
    rubricTests: activeKernel.finalTestRubric,
    finalTestResults
  };
}
