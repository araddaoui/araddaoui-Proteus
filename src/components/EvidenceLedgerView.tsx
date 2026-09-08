import React, { useState } from 'react';
import { EvidenceClaim, EvidenceStagingItem, ConfidenceTier, UserRole } from '../types';
import {
  FileText,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  ShieldCheck,
  Search,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface EvidenceLedgerViewProps {
  claims: EvidenceClaim[];
  staging: EvidenceStagingItem[];
  userRole: UserRole;
  onAddClaim: (claim: Omit<EvidenceClaim, 'id' | 'dateAdded'>) => void;
  onApproveStaging: (stagingId: string) => void;
  onRejectStaging: (stagingId: string, reason: string) => void;
}

export const EvidenceLedgerView: React.FC<EvidenceLedgerViewProps> = ({
  claims,
  staging,
  userRole,
  onAddClaim,
  onApproveStaging,
  onRejectStaging,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'live' | 'staging'>('live');
  const [filterConfidence, setFilterConfidence] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Claim Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [claimText, setClaimText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [confidenceTier, setConfidenceTier] = useState<ConfidenceTier>('peer_reviewed');
  const [datePublished, setDatePublished] = useState(new Date().toISOString().split('T')[0]);
  const [discipline, setDiscipline] = useState('');
  const [formError, setFormError] = useState('');

  const canEdit = userRole === 'leadership' || userRole === 'consultant';
  const pendingStagingCount = staging.filter((s) => s.status === 'pending_review').length;

  const filteredClaims = claims.filter((claim) => {
    if (filterConfidence !== 'all' && claim.confidenceTier !== filterConfidence) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        claim.claimText.toLowerCase().includes(q) ||
        claim.sourceName.toLowerCase().includes(q) ||
        claim.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // HARD NON-NEGOTIABLE GUARDRAIL: Claims without a source cannot be saved!
    if (!sourceUrl || sourceUrl.trim() === '') {
      setFormError('COMPASS_GUARDRAIL_VIOLATION: Factual claims without a source_url cannot be saved to the Evidence Ledger.');
      return;
    }

    if (!claimText.trim()) {
      setFormError('Please enter the claim text.');
      return;
    }

    try {
      onAddClaim({
        tenantId: 'inst-1',
        claimText,
        sourceUrl,
        sourceName: sourceName || 'External Source',
        confidenceTier,
        datePublished,
        retractionStatus: 'active',
        tags: ['user_added', discipline.toLowerCase().replace(/\s+/g, '_')].filter(Boolean),
        discipline,
      });

      setShowAddModal(false);
      setClaimText('');
      setSourceUrl('');
      setSourceName('');
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const getConfidenceBadge = (tier: ConfidenceTier) => {
    switch (tier) {
      case 'peer_reviewed':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Peer-Reviewed</span>;
      case 'vendor_reported':
        return <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Vendor-Reported</span>;
      case 'journalistic':
        return <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Journalistic</span>;
      case 'anecdotal':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Anecdotal</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Unverified</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
            <FileText className="w-5 h-5 text-indigo-600" /> Evidence Ledger & Epistemics Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Section XVI: Factual claims require source URLs and explicit confidence tags. Retracted claims are flagged instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 border border-slate-200 p-1 rounded-xl flex">
            <button
              onClick={() => setActiveSubTab('live')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeSubTab === 'live' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Ledger ({claims.length})
            </button>
            <button
              onClick={() => setActiveSubTab('staging')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'staging' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Staging Queue ({pendingStagingCount})
              {pendingStagingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              )}
            </button>
          </div>

          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Propose Claim
            </button>
          )}
        </div>
      </div>

      {/* Live Ledger View */}
      {activeSubTab === 'live' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search claims by keyword, source, or tag..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600 font-bold">Confidence Tier:</span>
              <select
                value={filterConfidence}
                onChange={(e) => setFilterConfidence(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="all">All Tiers</option>
                <option value="peer_reviewed">Peer-Reviewed</option>
                <option value="vendor_reported">Vendor-Reported</option>
                <option value="journalistic">Journalistic</option>
                <option value="anecdotal">Anecdotal</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Claims List Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {filteredClaims.map((claim) => (
                <div key={claim.id} className="p-5 space-y-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getConfidenceBadge(claim.confidenceTier)}
                      {claim.retractionStatus === 'retracted' && (
                        <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> RETRACTED CLAIM
                        </span>
                      )}
                      {claim.retractionStatus === 'disputed' && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                          Disputed Findings
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      Pub: {claim.datePublished} • Added: {claim.dateAdded}
                    </span>
                  </div>

                  <p className="text-sm text-slate-900 leading-relaxed font-sans font-medium">{claim.claimText}</p>

                  <div className="flex flex-wrap justify-between items-center text-xs border-t border-slate-100 pt-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-bold">Source: {claim.sourceName}</span>
                      <a
                        href={claim.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-700 hover:text-cyan-800 flex items-center gap-1 font-mono text-[11px] bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded font-bold"
                      >
                        Verify Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex gap-1.5">
                      {claim.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Staging Queue View (Semi-Automated Job Review) */}
      {activeSubTab === 'staging' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-900 flex items-start gap-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold">Semi-Automated Scraper Review Queue (Job #1)</span>
              <p className="text-slate-600 mt-0.5">
                The weekly background job scans EDUCAUSE, UNESCO, and Retraction Watch for candidate claims. Human approval is required before entries are saved to the live Evidence Ledger.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {staging.map((item) => (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-5 space-y-3 transition-colors shadow-sm ${
                  item.status === 'pending_review'
                    ? 'border-indigo-300 ring-2 ring-indigo-500/10'
                    : 'border-slate-200 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    {getConfidenceBadge(item.confidenceTier)}
                    <span className="font-mono text-slate-500 font-semibold">Discovered: {new Date(item.discoveredAt).toLocaleDateString()}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      item.status === 'pending_review'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : item.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-sm text-slate-900 leading-relaxed font-sans font-medium">{item.claimText}</p>

                <div className="flex flex-wrap justify-between items-center text-xs border-t border-slate-100 pt-2.5 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-bold">Source: {item.sourceName}</span>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-700 hover:text-cyan-800 flex items-center gap-1 font-mono text-[11px] font-bold"
                    >
                      {item.sourceUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {item.status === 'pending_review' && canEdit && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApproveStaging(item.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve to Ledger
                      </button>
                      <button
                        onClick={() => onRejectStaging(item.id, 'Unverified source quality')}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 border border-rose-200"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Propose Claim Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-fadeIn text-slate-900">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Propose New Factual Claim
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <span className="font-medium">{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateClaim} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">Factual Claim Text</label>
                <textarea
                  rows={3}
                  value={claimText}
                  onChange={(e) => setClaimText(e.target.value)}
                  placeholder="State the empirical or research finding clearly..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none font-sans font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold text-amber-800 flex items-center gap-1">
                  Source URL (MANDATORY <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />)
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Source Name</label>
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    placeholder="e.g. Stanford AI Study"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Confidence Tier</label>
                  <select
                    value={confidenceTier}
                    onChange={(e) => setConfidenceTier(e.target.value as ConfidenceTier)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  >
                    <option value="peer_reviewed">Peer-Reviewed</option>
                    <option value="journalistic">Journalistic</option>
                    <option value="vendor_reported">Vendor-Reported</option>
                    <option value="anecdotal">Anecdotal</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Date Published</label>
                  <input
                    type="date"
                    value={datePublished}
                    onChange={(e) => setDatePublished(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Academic Discipline</label>
                  <input
                    type="text"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    placeholder="e.g. Pedagogy"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Save Claim to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
