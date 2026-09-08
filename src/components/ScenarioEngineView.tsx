import React, { useState } from 'react';
import { DecisionRecord, ScenarioEntry, UserRole, HumanDisposition, Institution, AuditDossierData } from '../types';
import {
  FileCheck2,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Layers,
  Check,
  RotateCcw,
  Plus,
  Compass,
  FileText,
  Award,
  Users,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { AuditDossierModal } from './AuditDossierModal';

interface ScenarioEngineViewProps {
  decisions: DecisionRecord[];
  scenarios: ScenarioEntry[];
  userRole: UserRole;
  institution?: Institution | null;
  onUpdateDisposition: (id: string, disposition: HumanDisposition, notes: string, setBy: string) => void;
  onUpdateStatus: (id: string, status: DecisionRecord['implementationStatus']) => void;
  onToggleGate: (id: string, passed: boolean) => void;
  onGenerateAiScenarios: (decision: DecisionRecord) => Promise<void>;
  onAddDecision: (decision: Omit<DecisionRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateGovernanceSignoff?: (
    id: string,
    signoffType: 'academic' | 'administrative',
    status: 'approved' | 'rejected' | 'pending' | 'conditional',
    notes: string,
    signedBy: string
  ) => Promise<void> | void;
}

export const ScenarioEngineView: React.FC<ScenarioEngineViewProps> = ({
  decisions,
  scenarios,
  userRole,
  institution,
  onUpdateDisposition,
  onUpdateStatus,
  onToggleGate,
  onGenerateAiScenarios,
  onAddDecision,
  onUpdateGovernanceSignoff,
}) => {
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(decisions[0]?.id || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dossier Modal State
  const [activeDossier, setActiveDossier] = useState<AuditDossierData | null>(null);
  const [loadingDossier, setLoadingDossier] = useState(false);

  // Disposition Modal / Inputs
  const [dispositionInput, setDispositionInput] = useState<HumanDisposition>('accepted');
  const [dispositionNotes, setDispositionNotes] = useState('');
  const [dispositionUser, setDispositionUser] = useState('Dr. Evelyn Vance (Leadership)');

  // Governance Signoff Form states
  const [editingSignoffType, setEditingSignoffType] = useState<'academic' | 'administrative' | null>(null);
  const [signoffStatus, setSignoffStatus] = useState<'approved' | 'rejected' | 'pending' | 'conditional'>('approved');
  const [signoffNotes, setSignoffNotes] = useState('');
  const [signoffSigner, setSignoffSigner] = useState('');

  // New Decision Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newDomain, setNewDomain] = useState<DecisionRecord['domain']>('grading_assessment');
  const [newTouches, setNewTouches] = useState(true);

  const canEdit = userRole === 'leadership' || userRole === 'consultant' || userRole === 'faculty';
  const selectedDecision = decisions.find((d) => d.id === selectedDecisionId) || decisions[0];
  const decisionScenarios = scenarios.filter((s) => s.decisionId === selectedDecision?.id);

  const academicBodyLabel =
    selectedDecision?.academicSignoff?.bodyName ||
    institution?.academicGovernanceBodyName ||
    (institution?.academicGovernanceType === 'scientific_council' ? 'Faculty Scientific Council' : 'University Faculty Senate');

  const adminBodyLabel =
    selectedDecision?.administrativeSignoff?.bodyName ||
    institution?.provostOfficeName ||
    'Office of the Provost & Academic Affairs';

  const isDualApproved =
    selectedDecision?.academicSignoff?.status === 'approved' &&
    selectedDecision?.administrativeSignoff?.status === 'approved';

  const handleApplyDisposition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDecision || !canEdit) return;
    onUpdateDisposition(selectedDecision.id, dispositionInput, dispositionNotes, dispositionUser);
  };

  const handleStatusChange = (newStatus: DecisionRecord['implementationStatus']) => {
    setErrorMsg('');
    try {
      if (!selectedDecision) return;
      onUpdateStatus(selectedDecision.id, newStatus);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleSignoffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDecision || !editingSignoffType || !onUpdateGovernanceSignoff) return;
    try {
      await onUpdateGovernanceSignoff(
        selectedDecision.id,
        editingSignoffType,
        signoffStatus,
        signoffNotes || `Action confirmed by ${editingSignoffType === 'academic' ? academicBodyLabel : adminBodyLabel}.`,
        signoffSigner || (editingSignoffType === 'academic' ? 'Prof. Marcus Thorne, Senate Chair' : 'Dr. Evelyn Vance, Provost')
      );
      setEditingSignoffType(null);
      setSignoffNotes('');
      setSignoffSigner('');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleOpenDossier = async (decisionId: string) => {
    setLoadingDossier(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/decisions/${decisionId}/dossier`);
      if (!res.ok) {
        throw new Error('Failed to generate audit dossier');
      }
      const data = await res.json();
      setActiveDossier(data);
    } catch (err: any) {
      setErrorMsg('Error generating Audit Dossier: ' + err.message);
    } finally {
      setLoadingDossier(false);
    }
  };

  const handleDraftScenarios = async () => {
    if (!selectedDecision) return;
    setIsGeneratingAi(true);
    try {
      await onGenerateAiScenarios(selectedDecision);
    } catch (err: any) {
      setErrorMsg('AI generation error: ' + err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddDecision({
      tenantId: institution?.id || 'inst-1',
      title: newTitle,
      summary: newSummary,
      domain: newDomain,
      touchesEnrollmentOrGrading: newTouches,
      humanApprovalGatePassed: false,
      humanDisposition: null,
      implementationStatus: 'under_review',
      isAiDrafted: true,
      kernelSectionIds: ['II', 'V', 'VIII', 'XVI', 'XXX'],
      academicSignoff: {
        signoffType: 'academic',
        bodyName: academicBodyLabel,
        signedBy: null,
        signedAt: null,
        status: 'pending',
        resolutionNotes: 'Awaiting faculty governance plenary referral.'
      },
      administrativeSignoff: {
        signoffType: 'administrative',
        bodyName: adminBodyLabel,
        signedBy: null,
        signedAt: null,
        status: 'pending',
        resolutionNotes: 'Awaiting executive academic review.'
      }
    });

    setShowNewModal(false);
    setNewTitle('');
    setNewSummary('');
  };

  const getDispositionBadge = (disp: HumanDisposition) => {
    switch (disp) {
      case 'accepted':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Accepted by Human</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Rejected by Human</span>;
      case 'modified':
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-bold">Modified with Human Scope</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-600" /> Human Disposition Null / Pending</span>;
    }
  };

  const getScenarioTypeStyle = (type: ScenarioEntry['scenarioType']) => {
    switch (type) {
      case 'conservative':
        return { bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-900', badge: 'bg-slate-100 text-slate-700' };
      case 'moderate':
        return { bg: 'bg-blue-50/50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' };
      case 'ambitious':
        return { bg: 'bg-emerald-50/50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' };
      case 'adverse':
        return { bg: 'bg-rose-50/50', border: 'border-rose-200', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800' };
      case 'disruptive':
        return { bg: 'bg-purple-50/50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-100 text-purple-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Dossier Modal View */}
      {activeDossier && (
        <AuditDossierModal
          dossier={activeDossier}
          onClose={() => setActiveDossier(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold font-serif text-slate-900">
              Scenario Engine & Multi-Signature Governance
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-serif">
            Section II & XIV: Non-negotiable human disposition & dual academic/administrative consensus. No AI deployment impacting student progress or evaluation may proceed without explicit dual-signature authorization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedDecision && (
            <button
              onClick={() => handleOpenDossier(selectedDecision.id)}
              disabled={loadingDossier}
              className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs px-3.5 py-2 rounded-xl transition-all font-bold flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              {loadingDossier ? 'Generating Dossier...' : 'Export Board Audit Dossier'}
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" /> Propose AI Initiative
            </button>
          )}
        </div>
      </div>

      {/* Governance Body Structure Advisory */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-950">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold font-serif text-indigo-950">
              Active Institutional Governance Configuration:
            </span>{' '}
            <span className="font-medium text-indigo-900">
              Academic Body: <strong>{academicBodyLabel}</strong> ({institution?.academicGovernanceType === 'scientific_council' ? 'Faculty-Led Scientific Council' : 'Standing Faculty Senate'}) • Administration: <strong>{adminBodyLabel}</strong>
            </span>
            <p className="text-[11px] text-indigo-800/90 mt-0.5">
              Compass Mandate: In institutions where no standing Faculty Senate exists, a faculty-led Scientific Council or Academic Council must be formally constituted to ensure institutional decisions co-involve both academics and administrators.
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Decision Registry */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-slate-800 font-serif">Initiatives Under Deliberation</h3>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold">
              {decisions.length} Registered
            </span>
          </div>

          <div className="space-y-3">
            {decisions.map((d) => {
              const isSelected = d.id === selectedDecision?.id;
              const hasDualSig = d.academicSignoff?.status === 'approved' && d.administrativeSignoff?.status === 'approved';

              return (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDecisionId(d.id);
                    setErrorMsg('');
                    setEditingSignoffType(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-sm ring-2 ring-indigo-500/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{d.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded shrink-0 font-bold">
                      {d.domain.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                    {getDispositionBadge(d.humanDisposition)}
                    {d.touchesEnrollmentOrGrading && (
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-600" /> Human Gate Active
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        hasDualSig
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {hasDualSig ? '✓ Dual Signed' : 'Pending Sigs'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Workspace: Selected Decision Detail & Scenarios */}
        {selectedDecision && (
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message Alert */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-900 text-xs flex items-start gap-3 animate-fadeIn shadow-sm">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">GOVERNANCE ENFORCEMENT BLOCKED TRANSITION:</span>
                  <p className="mt-0.5 font-medium">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Selected Decision Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 font-serif">{selectedDecision.title}</h3>
                    {selectedDecision.isAiDrafted && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                        [AI-Drafted - Pending Human Review]
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedDecision.summary}</p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => handleOpenDossier(selectedDecision.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" /> Audit Dossier
                  </button>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-bold uppercase">
                    Status: <span className="text-indigo-700">{selectedDecision.implementationStatus}</span>
                  </span>
                </div>
              </div>

              {/* DUAL-SIGNATURE GOVERNANCE STATUS BLOCK (Section II & XIV) */}
              <div className="border border-indigo-100 rounded-2xl p-5 bg-gradient-to-br from-indigo-50/30 to-slate-50 space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-700" />
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider font-mono">
                      Multi-Signature Governance Consensus (Dual Sign-Off)
                    </h4>
                  </div>

                  <span
                    className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      isDualApproved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {isDualApproved ? '✓ Dual Signatures Approved' : '⚠ Dual Approval Required Prior to Implementation'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Academic Governance Box */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                        1. Academic Body (Faculty)
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          selectedDecision.academicSignoff?.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedDecision.academicSignoff?.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedDecision.academicSignoff?.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-slate-900 font-serif">
                      {selectedDecision.academicSignoff?.bodyName || academicBodyLabel}
                    </div>

                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      &ldquo;{selectedDecision.academicSignoff?.resolutionNotes || 'Awaiting formal faculty committee review.'}&rdquo;
                    </p>

                    <div className="text-[10px] text-slate-500 font-mono flex justify-between items-center pt-1 border-t border-slate-100">
                      <span>Signer: {selectedDecision.academicSignoff?.signedBy || 'Pending Plenary'}</span>
                      {canEdit && (
                        <button
                          onClick={() => {
                            setEditingSignoffType('academic');
                            setSignoffStatus(selectedDecision.academicSignoff?.status || 'approved');
                            setSignoffNotes(selectedDecision.academicSignoff?.resolutionNotes || '');
                            setSignoffSigner(selectedDecision.academicSignoff?.signedBy || 'Prof. Marcus Thorne, Senate Chair');
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                        >
                          Update Sign-off
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Administrative Governance Box */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                        2. Administrative Leadership
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          selectedDecision.administrativeSignoff?.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedDecision.administrativeSignoff?.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedDecision.administrativeSignoff?.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-slate-900 font-serif">
                      {selectedDecision.administrativeSignoff?.bodyName || adminBodyLabel}
                    </div>

                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      &ldquo;{selectedDecision.administrativeSignoff?.resolutionNotes || 'Awaiting executive academic affairs review.'}&rdquo;
                    </p>

                    <div className="text-[10px] text-slate-500 font-mono flex justify-between items-center pt-1 border-t border-slate-100">
                      <span>Signer: {selectedDecision.administrativeSignoff?.signedBy || 'Pending Provost'}</span>
                      {canEdit && (
                        <button
                          onClick={() => {
                            setEditingSignoffType('administrative');
                            setSignoffStatus(selectedDecision.administrativeSignoff?.status || 'approved');
                            setSignoffNotes(selectedDecision.administrativeSignoff?.resolutionNotes || '');
                            setSignoffSigner(selectedDecision.administrativeSignoff?.signedBy || 'Dr. Evelyn Vance, Provost');
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                        >
                          Update Sign-off
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inline Signoff Form Modal */}
                {editingSignoffType && (
                  <form onSubmit={handleSignoffSubmit} className="bg-white border-2 border-indigo-300 rounded-xl p-4 space-y-3 mt-3 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-bold font-serif text-slate-900">
                        Record Formal {editingSignoffType === 'academic' ? 'Academic Senate / Council' : 'Executive Administrative'} Resolution
                      </h5>
                      <button
                        type="button"
                        onClick={() => setEditingSignoffType(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Determination</label>
                        <select
                          value={signoffStatus}
                          onChange={(e) => setSignoffStatus(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 focus:border-indigo-500 font-medium"
                        >
                          <option value="approved">Approved</option>
                          <option value="conditional">Conditional Approval</option>
                          <option value="rejected">Rejected / Vetoed</option>
                          <option value="pending">Pending Further Deliberation</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Official Signer Name & Title</label>
                        <input
                          type="text"
                          value={signoffSigner}
                          onChange={(e) => setSignoffSigner(e.target.value)}
                          placeholder="e.g. Prof. Marcus Thorne, Senate Chair"
                          className="w-full bg-white border border-slate-200 rounded p-1.5 focus:border-indigo-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Resolution / Motion Notes</label>
                        <input
                          type="text"
                          value={signoffNotes}
                          onChange={(e) => setSignoffNotes(e.target.value)}
                          placeholder="Document official vote or resolution notes..."
                          className="w-full bg-white border border-slate-200 rounded p-1.5 focus:border-indigo-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingSignoffType(null)}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded shadow-sm hover:bg-indigo-700"
                      >
                        Certify & Save Sign-Off
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Guardrails Status Dashboard for Decision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                {/* Human Disposition Gate */}
                <div className="space-y-1.5">
                  <div className="text-slate-500 font-bold">1. Required Human Disposition:</div>
                  <div>{getDispositionBadge(selectedDecision.humanDisposition)}</div>
                  {selectedDecision.dispositionSetBy && (
                    <div className="text-[10px] text-slate-500 font-medium">
                      Set by {selectedDecision.dispositionSetBy} on {new Date(selectedDecision.dispositionSetAt || '').toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Enrollment / Grading Gate */}
                <div className="space-y-1.5">
                  <div className="text-slate-500 font-bold">2. Enrollment/Grading Hard Safety Gate:</div>
                  {selectedDecision.touchesEnrollmentOrGrading ? (
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded text-[11px] ${
                          selectedDecision.humanApprovalGatePassed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {selectedDecision.humanApprovalGatePassed ? 'Gate Passed (Approved)' : 'Gate Active (Hard Block)'}
                      </span>
                      {canEdit && (
                        <button
                          onClick={() => onToggleGate(selectedDecision.id, !selectedDecision.humanApprovalGatePassed)}
                          className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-0.5 rounded font-mono font-bold"
                        >
                          Toggle
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500 font-medium">Not Applicable (Does not touch grading/enrollment)</span>
                  )}
                </div>
              </div>

              {/* Human Disposition Form */}
              {canEdit && (
                <form onSubmit={handleApplyDisposition} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Set Human Strategic Disposition (Mandatory)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-700 font-bold">Disposition</label>
                      <select
                        value={dispositionInput || 'accepted'}
                        onChange={(e) => setDispositionInput(e.target.value as HumanDisposition)}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded p-2 focus:outline-none focus:border-indigo-500 mt-1 font-medium"
                      >
                        <option value="accepted">Accepted by Human</option>
                        <option value="modified">Modified Scope</option>
                        <option value="rejected">Rejected by Human</option>
                        <option value="pending">Pending Deliberation</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-slate-700 font-bold">Human Deliberation Rationale</label>
                      <input
                        type="text"
                        value={dispositionNotes}
                        onChange={(e) => setDispositionNotes(e.target.value)}
                        placeholder="Document human governance rationale..."
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded p-2 focus:outline-none focus:border-indigo-500 mt-1 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange('implemented')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-bold transition-colors shadow-sm"
                      >
                        Transition to Implemented
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange('shelved')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-1.5 rounded font-bold transition-colors"
                      >
                        Shelve Decision
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-1.5 rounded font-bold shadow-sm"
                    >
                      Record Disposition
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 5-Scenario Matrix Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                    <Compass className="w-5 h-5 text-indigo-600" /> Section V: 5 Linked Scenarios
                  </h3>
                  <p className="text-xs text-slate-500">
                    Non-technological drivers (demographics, economics, policy, geopolitics) explicitly required per scenario.
                  </p>
                </div>

                {canEdit && (
                  <button
                    onClick={handleDraftScenarios}
                    disabled={isGeneratingAi}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 font-bold disabled:opacity-50 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    {isGeneratingAi ? 'Synthesizing Scenarios...' : 'Draft 5 Scenarios (AI Assist)'}
                  </button>
                )}
              </div>

              {decisionScenarios.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3">
                  <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-sm font-bold text-slate-700 font-serif">No scenarios yet drafted for this decision</div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Section V mandates drafting at least 5 scenarios with explicit non-tech drivers and reversibility ratings.
                  </p>
                  {canEdit && (
                    <button
                      onClick={handleDraftScenarios}
                      disabled={isGeneratingAi}
                      className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs px-4 py-2 rounded-xl font-bold"
                    >
                      Draft Scenarios Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {decisionScenarios.map((scen) => {
                    const style = getScenarioTypeStyle(scen.scenarioType);

                    return (
                      <div
                        key={scen.id}
                        className={`p-5 rounded-2xl border shadow-sm space-y-3 ${style.bg} ${style.border}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${style.badge}`}>
                            {scen.scenarioType}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-bold bg-white/80 border border-slate-200 px-2 py-0.5 rounded">
                            Reversibility: {scen.reversibilityRating}/5
                          </span>
                        </div>

                        <div>
                          <h4 className={`text-sm font-bold font-serif ${style.text}`}>{scen.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{scen.description}</p>
                        </div>

                        {/* Non-Tech Drivers Matrix */}
                        <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3 text-[11px] space-y-1.5">
                          <div className="font-bold font-mono text-[10px] text-slate-500 uppercase">Non-Tech Drivers:</div>
                          <div className="grid grid-cols-2 gap-2 text-slate-700">
                            <div><strong className="text-slate-900">Demographics:</strong> {scen.nonTechDrivers.demographics}</div>
                            <div><strong className="text-slate-900">Economics:</strong> {scen.nonTechDrivers.economics}</div>
                            <div><strong className="text-slate-900">Policy:</strong> {scen.nonTechDrivers.policy}</div>
                            <div><strong className="text-slate-900">Geopolitics:</strong> {scen.nonTechDrivers.geopolitics}</div>
                          </div>
                        </div>

                        {/* Key Assumptions */}
                        {scen.keyAssumptions.length > 0 && (
                          <div className="text-[11px] space-y-1">
                            <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">Key Assumptions:</span>
                            <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                              {scen.keyAssumptions.map((a, idx) => (
                                <li key={idx} className="line-clamp-1">{a}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Propose AI Initiative Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" /> Propose New AI Initiative
            </h3>

            <form onSubmit={handleCreateDecision} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Automated Diagnostic Feedback Engine"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:border-indigo-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Summary & Operational Scope</label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  rows={3}
                  placeholder="Describe purpose, AI model utilized, and intended human oversight..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:border-indigo-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 font-medium"
                  >
                    <option value="grading_assessment">Grading & Assessment</option>
                    <option value="enrollment_admissions">Enrollment & Admissions</option>
                    <option value="pedagogy">Pedagogy & Curriculum</option>
                    <option value="research">Research & Discovery</option>
                    <option value="administration">Administration & Operations</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer pt-3">
                    <input
                      type="checkbox"
                      checked={newTouches}
                      onChange={(e) => setNewTouches(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Touches Enrollment or Grading?</span>
                  </label>
                  <span className="text-[10px] text-slate-500 mt-1">
                    Enforces strict dual Academic & Administrative sign-off gates.
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-sm"
                >
                  Submit for Deliberation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
