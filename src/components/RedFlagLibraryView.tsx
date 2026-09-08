import React, { useState } from 'react';
import { RedFlagCase, RedFlagCategory } from '../types';
import { AlertTriangle, ExternalLink, ShieldCheck, Search, Filter, Sparkles, BookOpen } from 'lucide-react';

interface RedFlagLibraryViewProps {
  redFlags: RedFlagCase[];
}

export const RedFlagLibraryView: React.FC<RedFlagLibraryViewProps> = ({ redFlags }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [proposalCheckInput, setProposalCheckInput] = useState('');
  const [matchedResults, setMatchedResults] = useState<RedFlagCase[] | null>(null);

  const filteredFlags = redFlags.filter((flag) => {
    if (selectedCategory !== 'all' && flag.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        flag.title.toLowerCase().includes(q) ||
        flag.caseSummary.toLowerCase().includes(q) ||
        flag.institutionOrContext.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRunSelfCheck = () => {
    if (!proposalCheckInput.trim()) return;
    const lowercase = proposalCheckInput.toLowerCase();

    const matches = redFlags.filter((flag) => {
      if (lowercase.includes('grad') || lowercase.includes('essay') || lowercase.includes('exam')) {
        return flag.category === 'integrity_collapse' || flag.category === 'overreliance';
      }
      if (lowercase.includes('bot') || lowercase.includes('withdraw') || lowercase.includes('advising')) {
        return flag.category === 'accreditation_gap' || flag.category === 'rollback_after_launch';
      }
      if (lowercase.includes('contract') || lowercase.includes('vendor') || lowercase.includes('data')) {
        return flag.category === 'vendor_lock_in';
      }
      return true;
    });

    setMatchedResults(matches.length > 0 ? matches : redFlags.slice(0, 2));
  };

  const getCategoryBadge = (cat: RedFlagCategory) => {
    switch (cat) {
      case 'accreditation_gap':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Accreditation Failure</span>;
      case 'integrity_collapse':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Integrity Chaos</span>;
      case 'rollback_after_launch':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Rapid Product Rollback</span>;
      case 'vendor_lock_in':
        return <span className="bg-cyan-100 text-cyan-800 border border-cyan-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold">Vendor Lock-In</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase">{cat.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
            <AlertTriangle className="w-5 h-5 text-rose-600" /> Documented Red-Flag Failure Library
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pre-seeded library of real documented higher ed AI failure patterns. Self-check proposed initiatives before launch.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl">
          {redFlags.length} Real Documented Cases
        </span>
      </div>

      {/* Interactive Proposal Self-Checker */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
          <Sparkles className="w-4 h-4 text-indigo-600" /> Self-Check Proposal Against Failure Library
        </h3>

        <div className="space-y-3">
          <textarea
            value={proposalCheckInput}
            onChange={(e) => setProposalCheckInput(e.target.value)}
            placeholder="Paste your proposed AI tool or initiative details here to scan for matching warning signs..."
            className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-sans resize-none font-medium"
          />
          <div className="flex justify-end">
            <button
              onClick={handleRunSelfCheck}
              disabled={!proposalCheckInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
            >
              Scan for Red-Flag Matches →
            </button>
          </div>
        </div>

        {/* Matches Output */}
        {matchedResults && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Matched Pattern Warnings & Preventions ({matchedResults.length})
            </h4>

            <div className="space-y-3">
              {matchedResults.map((m) => (
                <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{m.title}</span>
                    {getCategoryBadge(m.category)}
                  </div>
                  <p className="text-slate-700 text-[11px] font-medium">{m.caseSummary}</p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-emerald-900">Recommended Mitigations:</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 font-medium">
                      {m.mitigations.map((mit, i) => (
                        <li key={i}>{mit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Red-Flag Cards Grid */}
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search red flags by institution, pattern, or keyword..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:bg-white font-bold"
            >
              <option value="all">All Categories</option>
              <option value="accreditation_gap">Accreditation Failure</option>
              <option value="integrity_collapse">Integrity Collapse</option>
              <option value="rollback_after_launch">Rapid Rollback</option>
              <option value="vendor_lock_in">Vendor Lock-In</option>
              <option value="overreliance">Overreliance</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4">
          {filteredFlags.map((flag) => (
            <div key={flag.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-serif">{flag.title}</h3>
                    {getCategoryBadge(flag.category)}
                  </div>
                  <span className="text-xs text-slate-500 font-mono font-medium">Context: {flag.institutionOrContext}</span>
                </div>

                <a
                  href={flag.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-800 hover:text-cyan-900 text-xs font-mono font-bold flex items-center gap-1 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded"
                >
                  Verify Source Case <ExternalLink className="w-3 h-3 text-cyan-600" />
                </a>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-amber-900">Case Summary:</span>
                  <p className="text-slate-800 text-xs mt-1 leading-relaxed font-medium">{flag.caseSummary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-rose-50/80 border border-rose-200 p-3 rounded-xl space-y-1">
                    <span className="font-bold text-rose-900">Warning Signs to Watch:</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-800 space-y-0.5 font-medium">
                      {flag.warningSigns.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-900">Mandatory Mitigations:</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-800 space-y-0.5 font-medium">
                      {flag.mitigations.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
