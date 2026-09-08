import React, { useState } from 'react';
import { Institution, OverlayPack, DecisionRecord, EvidenceClaim, ShadowAiReport, PredictionRecord } from '../types';
import { getActiveKernel, evaluateProposalAgainstKernel } from '../kernel/kernelModule';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  HelpCircle,
  Activity,
  Layers,
  Lock,
} from 'lucide-react';

interface DashboardOverviewProps {
  institution: Institution;
  activeOverlayPack: OverlayPack;
  decisions: DecisionRecord[];
  claims: EvidenceClaim[];
  shadowReports: ShadowAiReport[];
  predictions: PredictionRecord[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  institution,
  activeOverlayPack,
  decisions,
  claims,
  shadowReports,
  predictions,
  onNavigateTab,
}) => {
  const kernel = getActiveKernel();
  const [proposalInput, setProposalInput] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const pendingDispositions = decisions.filter((d) => d.humanDisposition === null || d.humanDisposition === 'pending');
  const pastDuePredictions = predictions.filter(
    (p) => p.resolutionStatus === 'pending' && new Date(p.targetDate) <= new Date()
  );
  const flaggedShadowReports = shadowReports.filter((r) => r.status === 'flagged');

  const handleEvaluate = () => {
    if (!proposalInput.trim()) return;
    setIsEvaluating(true);
    setTimeout(() => {
      const res = evaluateProposalAgainstKernel(proposalInput);
      setEvaluationResult(res);
      setIsEvaluating(false);
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Philosophy Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/30">
                Governing Philosophy
              </span>
              <span className="text-slate-400 text-xs">Proteus Higher Ed Compass OS</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
              Strategic Intelligence for {institution.name}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              "{kernel.oneSentenceMission}"
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigateTab('compass_master')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Compass className="w-3.5 h-3.5" /> Explore Full 30-Section Compass Master & Final Tests →
              </button>
            </div>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs space-y-2 min-w-[260px]">
            <div className="flex justify-between text-slate-300 font-medium border-b border-slate-700 pb-1.5">
              <span>Jurisdiction:</span>
              <span className="text-cyan-300">{institution.legalJurisdiction}</span>
            </div>
            <div className="flex justify-between text-slate-300 font-medium border-b border-slate-700 pb-1.5">
              <span>Accreditors:</span>
              <span className="text-cyan-300 truncate max-w-[150px]">{institution.accreditors.join(', ')}</span>
            </div>
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Active Overlay Pack:</span>
              <span className="text-emerald-400 font-semibold">{activeOverlayPack.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Negotiable Guardrails Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-800 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">Structural Guardrails & Safety Floor Status</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              1. Required Human Disposition ({pendingDispositions.length} decisions pending human review) • 2. Hardcoded Human Gate on Enrollment/Grading • 3. Source URL requirement on Evidence Ledger.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('scenarios')}
          className="bg-amber-800 hover:bg-amber-900 text-white text-xs px-3.5 py-2 rounded-lg font-bold transition-colors whitespace-nowrap self-start md:self-auto shadow-sm"
        >
          Review Pending Decisions →
        </button>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('scenarios')}
          className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 cursor-pointer transition-all shadow-sm hover:shadow-md space-y-2 group"
        >
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Decision Pipeline</span>
            <FileCheck2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{decisions.length}</div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-amber-700 font-bold">{pendingDispositions.length}</span> pending human disposition
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('evidence')}
          className="bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-5 cursor-pointer transition-all shadow-sm hover:shadow-md space-y-2 group"
        >
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Evidence Claims</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{claims.length}</div>
          <p className="text-[11px] text-slate-500">
            <span className="font-bold text-emerald-700">{claims.filter((c) => c.confidenceTier === 'peer_reviewed').length}</span> peer-reviewed • 100% sourced
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('input')}
          className="bg-white border border-slate-200 hover:border-rose-300 rounded-xl p-5 cursor-pointer transition-all shadow-sm hover:shadow-md space-y-2 group"
        >
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Shadow AI Reports</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{shadowReports.length}</div>
          <p className="text-[11px] text-slate-500">
            <span className="text-rose-700 font-bold">{flaggedShadowReports.length}</span> unaddressed course flags
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('predictions')}
          className="bg-white border border-slate-200 hover:border-cyan-300 rounded-xl p-5 cursor-pointer transition-all shadow-sm hover:shadow-md space-y-2 group"
        >
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Prediction Reconciliation</span>
            <Activity className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{predictions.length}</div>
          <p className="text-[11px] text-slate-500">
            <span className="text-amber-700 font-bold">{pastDuePredictions.length}</span> past due for outcome entry
          </p>
        </div>
      </div>

      {/* Quick Proposal Evaluator (The Final Test Rubric Tool) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> Quick Proposal Evaluator (The Final Test)
            </h3>
            <p className="text-xs text-slate-500">
              Test any proposed AI initiative against the 12 non-negotiable evaluative rubrics of Section XXX before adoption.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded font-bold">
            Compass Kernel Section XXX
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            value={proposalInput}
            onChange={(e) => setProposalInput(e.target.value)}
            placeholder="e.g., Deploy an AI chatbot to automatically grade 100-level essays and handle course withdrawal requests..."
            className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none font-sans"
          />
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="text-xs text-slate-500">
              Matches proposal against 30 Compass principles & 12 Final Test rubrics.
            </div>
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || !proposalInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {isEvaluating ? 'Evaluating against Kernel...' : 'Run Final Test Assessment →'}
            </button>
          </div>
        </div>

        {/* Evaluation Results Card */}
        {evaluationResult && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" /> Compass Kernel Evaluation Report
              </h4>
              <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                {evaluationResult.matchedPrinciples.length} Principles Triggered
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-white p-3 rounded-lg border border-amber-200 bg-amber-50/50 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Non-Negotiable Human-in-the-Loop Floor Check:
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  If this proposal touches grading, enrollment status, or degree progress, Section II & IV require an explicit human-approval gate and an updated human disposition record before implementation can proceed.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 mb-2">Key Triggered Compass Principles:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {evaluationResult.matchedPrinciples.map((p: any) => (
                    <div key={p.id} className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                      <div className="font-mono text-[11px] text-indigo-700 font-bold">
                        Section {p.id}: {p.title}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{p.summary}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 mb-2">The 12 Final Test Rubric Questions:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {evaluationResult.rubricTests.map((test: any) => (
                    <div key={test.id} className="bg-white border border-slate-200 p-2.5 rounded-lg text-[11px] shadow-sm">
                      <span className="font-bold text-indigo-900">{test.title}:</span>
                      <p className="text-slate-600 mt-0.5">{test.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
