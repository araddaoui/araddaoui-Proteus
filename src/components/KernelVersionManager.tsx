import React, { useState } from 'react';
import { getActiveKernel, getKernelVersionHistory } from '../kernel/kernelModule';
import { Compass, BookOpen, Layers, ShieldCheck, History, Search } from 'lucide-react';

export const KernelVersionManager: React.FC = () => {
  const kernel = getActiveKernel();
  const versionHistory = getKernelVersionHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrinciples = kernel.principles.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.id.toLowerCase() === q;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-serif">
            <Compass className="w-5 h-5 text-indigo-400" /> Compass Kernel v{kernel.version} & Governance Rules
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Section IV: Importable rules module. Kernel changes require human authorship, version bumps, and changelog rationale.
          </p>
        </div>

        <span className="text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1.5 rounded-xl font-bold">
          30 Principles • 12 Final Tests
        </span>
      </div>

      {/* Non-Negotiable Kernel Rule Banner */}
      <div className="bg-slate-950 border border-indigo-800/60 p-4 rounded-xl text-xs text-slate-300 space-y-1">
        <span className="font-bold text-indigo-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" /> Architectural Principle: Versioned Importable Kernel
        </span>
        <p className="text-slate-400 leading-relaxed">
          The Compass principles are stored in <code className="text-cyan-300 font-mono">/src/kernel/compass-v1.0.json</code> rather than embedded as prose in UI code. Kernel changes are the one thing in Proteus that remains human-authored and manually reviewed — no auto-update job is permitted.
        </p>
      </div>

      {/* Version History Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
          <History className="w-4 h-4 text-cyan-400" /> Kernel Version History & Changelog
        </h3>

        <div className="space-y-3">
          {versionHistory.map((ver) => (
            <div key={ver.version} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono">{ver.name}</span>
                  <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] px-2 py-0.5 rounded font-mono">
                    v{ver.version}
                  </span>
                </div>
                <span className="text-slate-400 font-mono">{ver.releaseDate}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{ver.changelogRationale}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Principle Traceability Browser */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Browse 30 Compass Principles
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search principles..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrinciples.map((principle) => (
            <div key={principle.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded text-[11px]">
                  Section {principle.id}
                </span>
                <h4 className="font-bold text-white font-serif">{principle.title}</h4>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">{principle.summary}</p>

              <div className="border-t border-slate-800/80 pt-2 space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Key Directives:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                  {principle.keyDirectives.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
