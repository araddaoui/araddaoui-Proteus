import React, { useState, useEffect } from 'react';
import { UserRole, CompassSection, FinalTestAuditEntry, Institution } from '../types';
import {
  Compass,
  Scale,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  BookOpen,
  Info,
  HelpCircle,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { getActiveKernel, INSTITUTIONAL_DIAGNOSTIC_CATEGORIES } from '../kernel/kernelModule';

interface CompassMasterViewProps {
  userRole: UserRole;
  currentTenantId: string;
  institution: Institution;
  onNavigateTab?: (tab: string) => void;
}

export const CompassMasterView: React.FC<CompassMasterViewProps> = ({
  userRole,
  currentTenantId,
  institution,
  onNavigateTab
}) => {
  const kernel = getActiveKernel();
  const [activeSubTab, setActiveSubTab] = useState<'browser' | 'final_test' | 'diagnostic' | 'possibility'>('browser');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>('I');

  // Final Test Audit State
  const [proposalInput, setProposalInput] = useState<string>(
    'Deploy an automated algorithmic scoring engine for freshman essays with direct sync to registrar gradebook.'
  );
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditResults, setAuditResults] = useState<{
    matchedPrinciples: CompassSection[];
    finalTestResults: FinalTestAuditEntry[];
  } | null>(null);

  // Diagnostic Checklist State (Section VI)
  const [diagnosticData, setDiagnosticData] = useState<{
    total: number;
    availableCount: number;
    completionPercentage: number;
    missingItems: any[];
    items: any[];
    mandatoryGapStatement: string;
  } | null>(null);
  const [loadingDiag, setLoadingDiag] = useState(false);

  // Load diagnostic data for current tenant
  const loadDiagnostics = async () => {
    try {
      setLoadingDiag(true);
      const res = await fetch(`/api/compass/diagnostic/${currentTenantId}`).then(r => r.json());
      setDiagnosticData(res);
    } catch (err) {
      console.error('Failed to load diagnostics:', err);
    } finally {
      setLoadingDiag(false);
    }
  };

  useEffect(() => {
    loadDiagnostics();
  }, [currentTenantId]);

  const handleToggleDiag = async (diagId: string, currentVal: boolean) => {
    try {
      await fetch(`/api/compass/diagnostic/${currentTenantId}/${diagId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !currentVal })
      });
      loadDiagnostics();
    } catch (err) {
      console.error('Failed to toggle diagnostic item:', err);
    }
  };

  const handleRunAudit = async () => {
    if (!proposalInput.trim()) return;
    setAuditRunning(true);
    try {
      const res = await fetch('/api/compass/final-test-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalText: proposalInput, role: userRole })
      }).then(r => r.json());

      setAuditResults({
        matchedPrinciples: res.matchedPrinciples || [],
        finalTestResults: res.finalTestResults || []
      });
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setAuditRunning(false);
    }
  };

  // Filter principles
  const filteredPrinciples = kernel.principles.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keyDirectives.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTheme = selectedTheme === 'all' || p.theme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const themeLabels: Record<string, { label: string; count: number }> = {
    all: { label: 'All 30 Sections', count: kernel.principles.length },
    epistemic_agency: { label: 'Epistemic & Human Agency', count: kernel.principles.filter(p => p.theme === 'epistemic_agency').length },
    common_good_governance: { label: 'Common Good & Governance', count: kernel.principles.filter(p => p.theme === 'common_good_governance').length },
    academic_pluralism: { label: 'Academic Pluralism & Pedagogy', count: kernel.principles.filter(p => p.theme === 'academic_pluralism').length },
    whole_ecosystem: { label: 'Whole Ecosystem & Workforce', count: kernel.principles.filter(p => p.theme === 'whole_ecosystem').length },
    safety_procurement: { label: 'Risk, Safety & Procurement', count: kernel.principles.filter(p => p.theme === 'safety_procurement').length }
  };

  return (
    <div className="space-y-8" id="compass-master-view">
      {/* Supreme Master Orientation Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider font-mono">
              <Compass className="w-3.5 h-3.5 text-indigo-400" /> Master Foundational Architecture
            </div>
            <span className="text-xs text-indigo-300 font-mono">
              Kernel Release v{kernel.version} • 30 Foundational Sections • 12 Final Tests
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif text-white">
              The Higher Education AI Compass
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-serif italic max-w-4xl leading-relaxed">
              &ldquo;Human flourishing is the objective. AI is neither the objective nor the enemy. Its purpose is not to make universities more technological for the sake of technology, nor to preserve existing institutions for the sake of tradition, but to help navigate profound change while protecting and advancing the core purposes of higher education.&rdquo;
            </p>
          </div>

          {/* Governing Question & Operating Principle Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950/70 border border-indigo-800/50 p-4 rounded-2xl space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> The Governing Question
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-serif font-medium leading-snug">
                &ldquo;What arrangements best serve human beings, knowledge, society, and the future under changing conditions?&rdquo;
              </p>
            </div>

            <div className="bg-slate-950/70 border border-indigo-800/50 p-4 rounded-2xl space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> The Operating Principle
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-serif font-medium leading-snug">
                &ldquo;Do not ask first: &apos;What can AI do for the university?&apos; Ask: &apos;What kind of university does society need, what kind of human beings should it help develop, and what knowledge should it cultivate?&apos;&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('browser')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'browser'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 30 Principles Browser
          </button>

          <button
            onClick={() => setActiveSubTab('final_test')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'final_test'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" /> Section XXX Final Test Audit (12 Gates)
          </button>

          <button
            onClick={() => setActiveSubTab('diagnostic')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'diagnostic'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Section VI Institutional Diagnostic (32 Datasets)
          </button>

          <button
            onClick={() => setActiveSubTab('possibility')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === 'possibility'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Possibility Spaces & Autonomy Matrix
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Institution: <span className="font-bold text-slate-800">{institution.name}</span>
        </div>
      </div>

      {/* SUBTAB 1: 30 Principles Browser */}
      {activeSubTab === 'browser' && (
        <div className="space-y-6">
          {/* Controls: Filter & Search */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search directives, keywords, questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {Object.entries(themeLabels).map(([themeKey, { label, count }]) => (
                  <button
                    key={themeKey}
                    onClick={() => setSelectedTheme(themeKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedTheme === themeKey
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Principle Accordion Cards */}
          <div className="space-y-4">
            {filteredPrinciples.map((principle) => {
              const isExpanded = expandedSectionId === principle.id;

              return (
                <div
                  key={principle.id}
                  className={`bg-white border rounded-2xl transition-all shadow-sm ${
                    isExpanded ? 'border-indigo-400 ring-1 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Header row */}
                  <div
                    onClick={() => setExpandedSectionId(isExpanded ? null : principle.id)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-serif font-bold text-indigo-800 text-sm shrink-0">
                        {principle.id}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 font-serif">
                            Section {principle.id}. {principle.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{principle.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 uppercase border border-slate-200">
                        {principle.theme.replace('_', ' ')}
                      </span>
                      <span className="text-indigo-600 text-xs font-bold font-mono">
                        {isExpanded ? 'Collapse' : 'Inspect'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-2xl space-y-6">
                      {/* Summary */}
                      <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Summary & Intent
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                          {principle.summary}
                        </p>
                      </div>

                      {/* Key Directives */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Key Master Directives
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {principle.keyDirectives.map((directive, i) => (
                            <div
                              key={i}
                              className="bg-white border border-slate-200 p-3.5 rounded-xl text-xs text-slate-700 leading-relaxed flex items-start gap-2.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                              <span>{directive}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Diagnostic Questions (if available) */}
                      {principle.diagnosticQuestions && principle.diagnosticQuestions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-amber-600" /> Mandatory Diagnostic Inquiries
                          </h4>
                          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                            {principle.diagnosticQuestions.map((q, i) => (
                              <div key={i} className="text-xs text-amber-950 font-serif italic flex items-center gap-2">
                                <span className="font-mono text-amber-700 font-bold">•</span>
                                <span>&ldquo;{q}&rdquo;</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Enumerated Sub-Items / Categorical Taxonomies */}
                      {principle.subItems && principle.subItems.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-slate-500" /> Categorical Taxonomy & Dimensions ({principle.subItems.length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {principle.subItems.map((item, i) => (
                              <div
                                key={i}
                                className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <span className="truncate">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Governing Quotes */}
                      {principle.governingQuotes && (
                        <div className="border-l-4 border-indigo-600 pl-4 py-1 italic text-xs sm:text-sm text-indigo-950 font-serif font-semibold">
                          {principle.governingQuotes.map((q, i) => (
                            <p key={i}>&ldquo;{q}&rdquo;</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Section XXX Final Test Audit (12 Gates) */}
      {activeSubTab === 'final_test' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-base font-serif">
                <Scale className="w-5 h-5 text-indigo-600" /> Section XXX: The 12-Gate Final Test Rubric
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Before authorizing any consequential recommendation, deployment, or policy, apply the 12 non-negotiable evaluative tests.
                <span className="font-bold text-slate-900">
                  {' '}Section XXX Rule: If a proposal fails one or more tests, do NOT automatically reject it. Surface the failure, explain the trade-off, and mandate deliberate human judgment.
                </span>
              </p>
            </div>

            {/* Test Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Initiative / AI Proposal Text:
              </label>
              <textarea
                value={proposalInput}
                onChange={(e) => setProposalInput(e.target.value)}
                rows={3}
                placeholder="Enter description of the proposed AI system, curriculum change, or procurement..."
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="font-semibold">Quick Presets:</span>
                <button
                  onClick={() =>
                    setProposalInput(
                      'Automated grading of student final exams in general chemistry using multi-modal AI API without professor verification.'
                    )
                  }
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Automated Grading
                </button>
                <span>•</span>
                <button
                  onClick={() =>
                    setProposalInput(
                      'Procure closed proprietary predictive advising platform with multi-year contract and proprietary student risk models.'
                    )
                  }
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Proprietary Vendor Lock-in
                </button>
                <span>•</span>
                <button
                  onClick={() =>
                    setProposalInput(
                      'Retire the Department of Classical Philosophy and Languages based strictly on 3-year enrollment metrics.'
                    )
                  }
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Retire Philosophy Dept
                </button>
              </div>

              <button
                onClick={handleRunAudit}
                disabled={auditRunning || !proposalInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {auditRunning ? 'Evaluating 12 Gates...' : 'Execute Section XXX Audit'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Static or Active Audit Output */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              {auditResults ? 'Section XXX Audit Results & Trade-Off Matrix' : 'The 12 Master Test Rubrics'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(auditResults ? auditResults.finalTestResults : kernel.finalTestRubric).map((test: any, idx) => {
                const status = test.status || 'passed';
                const isFail = status === 'failed_deliberation_required';
                const isWarn = status === 'warning_surfaced';

                return (
                  <div
                    key={test.id}
                    className={`bg-white border rounded-2xl p-5 space-y-3 shadow-sm flex flex-col justify-between ${
                      isFail
                        ? 'border-red-300 ring-1 ring-red-200 bg-red-50/20'
                        : isWarn
                        ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          Gate #{idx + 1}
                        </span>
                        {auditResults ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              isFail
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : isWarn
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isFail ? 'Deliberation Required' : isWarn ? 'Trade-Off Surfaced' : 'Passed'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 font-medium">Standard</span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 font-serif">{test.title}</h4>
                      <p className="text-xs text-slate-600 italic font-serif">&ldquo;{test.question}&rdquo;</p>

                      {test.directive && (
                        <p className="text-[11px] text-slate-500 leading-relaxed">{test.directive}</p>
                      )}
                    </div>

                    {test.tradeoffNotes && (
                      <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl space-y-1">
                        <span className="font-bold text-indigo-900 block font-mono text-[10px] uppercase">
                          Trade-Off Analysis:
                        </span>
                        <p className="leading-snug">{test.tradeoffNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {auditResults && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-2 text-sm font-serif">
                  <AlertTriangle className="w-4 h-4 text-amber-700" /> Section XXX Human Deliberation Mandate
                </div>
                <p className="leading-relaxed">
                  The Section XXX engine identified trade-offs or critical guardrails requiring conscious institutional review.
                  Per Compass Section II, no AI system is permitted to serve as autonomous authority. Proceed to the
                  <strong> Scenario Engine & Decisions</strong> tab to submit this through formal Senate and Academic Leadership disposition gates.
                </p>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('scenarios')}
                    className="mt-2 bg-amber-800 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-900 transition-colors inline-flex items-center gap-1.5"
                  >
                    Open Scenario Engine & Decisions <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Section VI Institutional Diagnostic Checklist */}
      {activeSubTab === 'diagnostic' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-serif">
                <FileText className="w-5 h-5 text-indigo-600" /> Section VI: Institutional Information Diagnostic Checklist
              </div>
              <p className="text-xs text-slate-600 mt-1">
                &ldquo;Before making recommendations, develop an institutional understanding. Do not pretend to understand an institution before examining its actual circumstances.
                <span className="font-bold text-slate-900"> Do not manufacture institutional facts.&rdquo;</span>
              </p>
            </div>

            {/* Coverage Progress Bar */}
            {diagnosticData && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-600 font-semibold">
                    Verified Datasets: {diagnosticData.availableCount} / {diagnosticData.total} Categories
                  </span>
                  <span className="font-bold text-indigo-700">{diagnosticData.completionPercentage}% Baseline Readiness</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${diagnosticData.completionPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Mandatory Gap Statement */}
            {diagnosticData && diagnosticData.missingItems.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-900 space-y-1.5">
                <div className="font-bold font-mono text-[11px] uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" /> Section VI Mandatory Missing Data Declaration
                </div>
                <p className="font-serif italic text-xs leading-relaxed">
                  &ldquo;{diagnosticData.mandatoryGapStatement}&rdquo;
                </p>
                <span className="text-[11px] text-red-700 block font-sans">
                  The Compass prohibits generating authoritative strategic advice until these baseline empirical inputs are integrated or their absence is explicitly accounted for.
                </span>
              </div>
            )}
          </div>

          {/* 32 Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(diagnosticData?.items || INSTITUTIONAL_DIAGNOSTIC_CATEGORIES).map((item: any) => {
              const isAvail = item.isAvailable;

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-xl p-4 transition-all shadow-sm flex flex-col justify-between ${
                    isAvail ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 bg-slate-50/30'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                        {item.category?.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isAvail
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isAvail ? 'Available' : 'Missing'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 font-serif">{item.name}</h4>
                    {item.notes && <p className="text-[11px] text-slate-500">{item.notes}</p>}
                  </div>

                  {userRole === 'leadership' && (
                    <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleToggleDiag(item.id, isAvail)}
                        className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg transition-colors ${
                          isAvail
                            ? 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                            : 'text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                        }`}
                      >
                        {isAvail ? 'Mark Missing' : 'Verify Available'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: Possibility Spaces & Autonomy Matrix (Sec. IV & VII) */}
      {activeSubTab === 'possibility' && (
        <div className="space-y-8">
          {/* Section IV: 5 Autonomy Levels */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-serif">
                <Users className="w-5 h-5 text-indigo-600" /> Section IV: The 5 Autonomy Levels & Substitution Floor
              </div>
              <p className="text-xs text-slate-600 mt-1">
                &ldquo;Do not assume that AI should replace what it can replace. Technical capability is not sufficient justification for substitution. Prefer augmentation over replacement where human participation provides substantial educational, ethical, relational, or civic value.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {[
                {
                  level: '1. Automation',
                  desc: 'Fully machine-executed. Only acceptable for non-consequential, deterministic tasks (e.g. room scheduling).',
                  color: 'bg-blue-50 border-blue-200 text-blue-900'
                },
                {
                  level: '2. Augmentation',
                  desc: 'AI enhances human analytical or creative capacity while human retains direct control and responsibility.',
                  color: 'bg-emerald-50 border-emerald-200 text-emerald-900'
                },
                {
                  level: '3. Delegation',
                  desc: 'AI carries out a bounded sub-task under strict human-defined parameters and retrospective review.',
                  color: 'bg-purple-50 border-purple-200 text-purple-900'
                },
                {
                  level: '4. Collaboration',
                  desc: 'Interactive human-AI dialogue and iterative deliberation with shared synthesis.',
                  color: 'bg-amber-50 border-amber-200 text-amber-900'
                },
                {
                  level: '5. Human-Only',
                  desc: 'Strictly prohibited from machine substitution (e.g. final grading, degree conferral, moral mentorship).',
                  color: 'bg-rose-50 border-rose-200 text-rose-900 font-bold'
                }
              ].map((item, idx) => (
                <div key={idx} className={`border rounded-2xl p-4 space-y-2 flex flex-col justify-between ${item.color}`}>
                  <div>
                    <h4 className="text-xs font-bold font-serif">{item.level}</h4>
                    <p className="text-[11px] leading-relaxed mt-1 opacity-90">{item.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono opacity-70 uppercase tracking-wider">Level {idx + 1} of 5</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section VII: 5 Possibility Spaces */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-serif">
                <Layers className="w-5 h-5 text-indigo-600" /> Section VII: The 5 Institutional Possibility Spaces
              </div>
              <p className="text-xs text-slate-600 mt-1">
                &ldquo;Never assume that every university can or should pursue the same transformation. Treat constraints as real, but distinguish current possibility space from expanded possibility space.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {[
                {
                  title: '1. Possible Now',
                  badge: 'Immediate',
                  desc: 'Executable under current budgets, technology systems, governance rules, and staffing without delays.',
                  badgeClass: 'bg-emerald-100 text-emerald-800'
                },
                {
                  title: '2. Modest Changes',
                  badge: 'Operational',
                  desc: 'Requires departmental agreement, minor software procurement, or internal workflow adjustments.',
                  badgeClass: 'bg-blue-100 text-blue-800'
                },
                {
                  title: '3. Substantial Change',
                  badge: 'Structural',
                  desc: 'Requires faculty senate approval, curriculum restructuring, union renegotiation, or capital reallocation.',
                  badgeClass: 'bg-purple-100 text-purple-800'
                },
                {
                  title: '4. Regulatory Change',
                  badge: 'External',
                  desc: 'Requires accreditor substantive change approval, state statutory revision, or federal regulatory reform.',
                  badgeClass: 'bg-amber-100 text-amber-800'
                },
                {
                  title: '5. Currently Impossible',
                  badge: 'Constrained',
                  desc: 'Untenable under existing legal, technological, ethical, or financial realities. Must not be feigned.',
                  badgeClass: 'bg-slate-200 text-slate-700'
                }
              ].map((space, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${space.badgeClass}`}>
                        {space.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">Space {idx + 1}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 font-serif">{space.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{space.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
