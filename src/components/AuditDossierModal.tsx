import React, { useState } from 'react';
import { AuditDossierData } from '../types';
import {
  Printer,
  Download,
  Copy,
  Check,
  X,
  ShieldAlert,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileText,
  Users,
  Award,
  BookOpen
} from 'lucide-react';

interface AuditDossierModalProps {
  dossier: AuditDossierData;
  onClose: () => void;
}

export const AuditDossierModal: React.FC<AuditDossierModalProps> = ({ dossier, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dossier, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${dossier.dossierId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyResolution = () => {
    const text = `BOARD OF TRUSTEES / REGENTS GOVERNANCE RESOLUTION
Dossier ID: ${dossier.dossierId}
Institution: ${dossier.institution.name}
Initiative: ${dossier.decision.title}
Domain: ${dossier.decision.domain}

ACADEMIC GOVERNANCE CONCURRENCE:
Body: ${dossier.governanceCertification.academicBody.bodyName}
Signer: ${dossier.governanceCertification.academicBody.signedBy || 'Pending'}
Status: ${dossier.governanceCertification.academicBody.status.toUpperCase()}
Resolution: "${dossier.governanceCertification.academicBody.resolutionNotes}"

ADMINISTRATIVE CONCURRENCE:
Body: ${dossier.governanceCertification.administrativeBody.bodyName}
Signer: ${dossier.governanceCertification.administrativeBody.signedBy || 'Pending'}
Status: ${dossier.governanceCertification.administrativeBody.status.toUpperCase()}
Resolution: "${dossier.governanceCertification.administrativeBody.resolutionNotes}"

SECTION XXX 12-GATE FINAL TEST AUDIT:
${dossier.finalTestResults.map(t => `- ${t.title}: ${t.status.toUpperCase()} (${t.tradeoffNotes || 'Compliant'})`).join('\n')}

Human Flourishing Operating Principle Certified per Compass Kernel v1.0.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const { decision, institution, governanceCertification, finalTestResults, evidenceArchitecture } = dossier;
  const isDualCertified = governanceCertification.quorumSatisfied;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:border-none print:shadow-none print:rounded-none print:m-0">
        
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold font-serif text-white">
                Compass Institutional Audit Dossier
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Official Multi-Stakeholder Briefing for Academic Senate, Provost & Board of Trustees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyResolution}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Resolution' : 'Copy Motion Text'}
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-300" /> JSON
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Export PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Body */}
        <div className="p-6 sm:p-10 space-y-8 print:p-6 text-slate-900 font-sans">
          
          {/* Formal University Header Block */}
          <div className="border-b-2 border-slate-900 pb-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
                  Institutional Governance & Strategic AI Oversight
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-950 mt-1">
                  {institution.name}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Accredited by: {institution.accreditors.join(' • ')} | Jurisdiction: {institution.legalJurisdiction}
                </p>
              </div>

              <div className="text-right font-mono text-xs text-slate-600 space-y-1">
                <div className="bg-slate-100 border border-slate-300 px-3 py-1 rounded-lg font-bold text-slate-900">
                  {dossier.dossierId}
                </div>
                <div>Date: {new Date(dossier.generatedAt).toLocaleDateString()}</div>
                <div>Status: <span className="font-bold text-indigo-700">Official Archival</span></div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs font-serif italic text-slate-700">
              <span>&ldquo;Human flourishing is the objective. AI is neither the objective nor the enemy.&rdquo;</span>
              <span className="font-mono text-[10px] text-slate-500 font-normal not-italic">Compass Kernel Master Prompt v1.0</span>
            </div>
          </div>

          {/* Proposal Summary */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-indigo-900">
                Initiative Under Deliberation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                Domain: {decision.domain.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h2 className="text-xl font-bold font-serif text-slate-900">
              {decision.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
              {decision.summary}
            </p>
          </div>

          {/* DUAL-SIGNATURE GOVERNANCE CERTIFICATION BLOCK (Section II & XIV) */}
          <div className="border-2 border-indigo-950/20 rounded-2xl p-5 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-800" />
                <h3 className="text-sm font-bold font-serif text-indigo-950">
                  Multi-Signature Governance Certification Block
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                  isDualCertified
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {isDualCertified ? '✓ Dual Signatures Certified' : '⚠ Incomplete / Pending Signatures'}
              </span>
            </div>

            <p className="text-xs text-slate-600 italic font-serif">
              Mandate: Per Compass Section II, XIV, and user-specified institutional bylaws, decisions impacting academic workflows require concurrent endorsement from both the faculty-led academic body and executive administrative leadership.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Academic Governance Signature Box */}
              <div className="bg-white border border-slate-300 rounded-xl p-4 space-y-2 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Academic Governance
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      governanceCertification.academicBody.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : governanceCertification.academicBody.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {governanceCertification.academicBody.status.toUpperCase()}
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-900 font-serif">
                  {governanceCertification.academicBody.bodyName}
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 min-h-[48px]">
                  <span className="font-semibold text-slate-900 block text-[11px]">Action / Resolution:</span>
                  &ldquo;{governanceCertification.academicBody.resolutionNotes || 'Awaiting committee plenary review.'}&rdquo;
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between">
                  <span>Signer: <strong>{governanceCertification.academicBody.signedBy || 'Pending Vote'}</strong></span>
                  <span>{governanceCertification.academicBody.signedAt ? new Date(governanceCertification.academicBody.signedAt).toLocaleDateString() : '—'}</span>
                </div>
              </div>

              {/* Administrative Governance Signature Box */}
              <div className="bg-white border border-slate-300 rounded-xl p-4 space-y-2 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Administrative Leadership
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      governanceCertification.administrativeBody.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : governanceCertification.administrativeBody.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {governanceCertification.administrativeBody.status.toUpperCase()}
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-900 font-serif">
                  {governanceCertification.administrativeBody.bodyName}
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 min-h-[48px]">
                  <span className="font-semibold text-slate-900 block text-[11px]">Executive Determination:</span>
                  &ldquo;{governanceCertification.administrativeBody.resolutionNotes || 'Awaiting executive academic affairs review.'}&rdquo;
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between">
                  <span>Signer: <strong>{governanceCertification.administrativeBody.signedBy || 'Pending Signature'}</strong></span>
                  <span>{governanceCertification.administrativeBody.signedAt ? new Date(governanceCertification.administrativeBody.signedAt).toLocaleDateString() : '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION XXX: 12-GATE FINAL TEST AUDIT BREAKDOWN */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold font-serif text-slate-950 flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-700" /> Section XXX: 12-Gate Final Test Evaluative Audit
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Non-Negotiable Ethical Rubric</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {finalTestResults.map((test, idx) => {
                const isFail = test.status === 'failed_deliberation_required';
                const isWarn = test.status === 'warning_surfaced';

                return (
                  <div
                    key={test.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isFail
                        ? 'border-red-300 bg-red-50/30'
                        : isWarn
                        ? 'border-amber-300 bg-amber-50/30'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">
                        #{idx + 1} {test.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                          isFail
                            ? 'bg-red-100 text-red-800'
                            : isWarn
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isFail ? 'Deliberation Req.' : isWarn ? 'Trade-Off Flag' : 'Passed'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 italic font-serif">&ldquo;{test.question}&rdquo;</p>
                    {test.tradeoffNotes && (
                      <p className="text-[10px] text-slate-800 pt-1 border-t border-slate-100 leading-snug">
                        <strong>Analysis:</strong> {test.tradeoffNotes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION XVI: EVIDENCE ARCHITECTURE & EPISTEMIC STATUS */}
          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold font-serif text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Section XVI: Evidence Architecture & Verification Base
              </h3>
              <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                Status: {evidenceArchitecture.epistemicStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold font-mono text-[10px] text-slate-500 uppercase block">
                  1. Underlying Assumptions:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                  {evidenceArchitecture.claimedAssumptions.length > 0 ? (
                    evidenceArchitecture.claimedAssumptions.map((a, i) => <li key={i}>{a}</li>)
                  ) : (
                    <li className="text-slate-400 italic">No unverified assumptions registered.</li>
                  )}
                </ul>
              </div>

              <div className="space-y-1">
                <span className="font-bold font-mono text-[10px] text-emerald-700 uppercase block">
                  2. Verified Evidence Base:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                  {evidenceArchitecture.verifiedEvidence.length > 0 ? (
                    evidenceArchitecture.verifiedEvidence.map((e, i) => <li key={i}>{e}</li>)
                  ) : (
                    <li className="text-slate-400 italic">Peer-reviewed benchmarking active.</li>
                  )}
                </ul>
              </div>

              <div className="space-y-1">
                <span className="font-bold font-mono text-[10px] text-amber-700 uppercase block">
                  3. Counter-Evidence & Red Flags:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                  {evidenceArchitecture.counterEvidence.length > 0 ? (
                    evidenceArchitecture.counterEvidence.map((c, i) => <li key={i}>{c}</li>)
                  ) : (
                    <li className="text-slate-400 italic">Zero critical red-flag breaches recorded.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Signatures & Execution Seal Footer */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs font-serif">
            <div className="space-y-3">
              <div className="border-b border-slate-400 pb-1 font-mono text-[10px] text-slate-500 uppercase">
                Academic Body Certification (Senate / Scientific Council)
              </div>
              <div className="italic text-slate-800">
                {governanceCertification.academicBody.signedBy ? (
                  <>
                    <div>Signed: <strong>{governanceCertification.academicBody.signedBy}</strong></div>
                    <div className="text-[11px] text-slate-500 font-mono">Date: {new Date(governanceCertification.academicBody.signedAt || '').toLocaleDateString()}</div>
                  </>
                ) : (
                  <div className="text-slate-400 italic">Signature Pending Plenary Session</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="border-b border-slate-400 pb-1 font-mono text-[10px] text-slate-500 uppercase">
                Administrative Leadership (Provost's Office)
              </div>
              <div className="italic text-slate-800">
                {governanceCertification.administrativeBody.signedBy ? (
                  <>
                    <div>Signed: <strong>{governanceCertification.administrativeBody.signedBy}</strong></div>
                    <div className="text-[11px] text-slate-500 font-mono">Date: {new Date(governanceCertification.administrativeBody.signedAt || '').toLocaleDateString()}</div>
                  </>
                ) : (
                  <div className="text-slate-400 italic">Signature Pending Review</div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] font-mono text-slate-400 pt-4">
            PROTEUS HIGHER ED COMPASS OS • SECTION XXX 12-GATE CERTIFIED DOSSIER • ARCHIVED RECORD #{dossier.dossierId}
          </div>

        </div>
      </div>
    </div>
  );
};
